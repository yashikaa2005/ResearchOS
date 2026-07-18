import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Sparkles,
  Network,
  Settings,
  Info,
  Plus,
  Trash2,
  Save,
  Upload,
  File,
  Search,
  CheckCircle,
  AlertTriangle,
  Loader
} from "lucide-react";
import { useProjects } from "../../context/ProjectContext";
import { useNotes } from "../../context/NoteContext";
import { usePapers } from "../../context/PaperContext";
import { getProjectById } from "../../services/project.service";
import { getProjectActivities, getProjectInsights, searchWorkspace } from "../../services/insight.service";
import KnowledgeGraph from "../../components/project/KnowledgeGraph";

const Workspace = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { updateProject, deleteProject } = useProjects();
  const { notes, activeNote, setActiveNote, fetchNotes, createNote, saveNote, deleteNote } = useNotes();
  const { papers, activePaper, setActivePaper, fetchPapers, uploadPaper, deletePaper, setPapers } = usePapers();

  // Local state
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview"); // overview, papers, notes, insights, graph, settings
  const [activities, setActivities] = useState([]);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Settings tab form state
  const [settingsTitle, setSettingsTitle] = useState("");
  const [settingsDesc, setSettingsDesc] = useState("");
  const [settingsColor, setSettingsColor] = useState("");
  const [settingsIcon, setSettingsIcon] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Note editor form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaveStatus, setNoteSaveStatus] = useState(""); // saved, unsaved, saving
  const [notePaperId, setNotePaperId] = useState("");

  // Upload PDF state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch project details
  const fetchProjectDetails = async () => {
    setProjectLoading(true);
    try {
      const res = await getProjectById(projectId);
      const proj = res.data;
      setProject(proj);
      setSettingsTitle(proj.title);
      setSettingsDesc(proj.description || "");
      setSettingsColor(proj.color);
      setSettingsIcon(proj.icon || "📚");
    } catch (err) {
      console.error("Failed to load project details:", err);
      navigate("/dashboard");
    } finally {
      setProjectLoading(false);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const res = await getProjectActivities(projectId);
      setActivities(res.data || []);
    } catch (err) {
      console.error("Failed to load activities:", err);
    }
  };

  // Fetch insights
  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await getProjectInsights(projectId);
      setInsights(res.data);
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Run initial queries
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchNotes(projectId);
      fetchPapers(projectId);
      fetchActivities();
    }
    setActiveNote(null);
    setActivePaper(null);
    setActiveTab("overview");
  }, [projectId]);

  // Load activities and insights on tab switch
  useEffect(() => {
    if (activeTab === "overview") {
      fetchActivities();
    } else if (activeTab === "insights") {
      fetchInsights();
    }
  }, [activeTab]);

  // Sync activeNote details to editor state
  useEffect(() => {
    if (activeNote) {
      setNoteTitle(activeNote.title);
      setNoteContent(activeNote.content || "");
      setNotePaperId(activeNote.paper?._id || activeNote.paper || "");
      setNoteSaveStatus("saved");
    } else {
      setNoteTitle("");
      setNoteContent("");
      setNotePaperId("");
      setNoteSaveStatus("");
    }
  }, [activeNote]);

  // Keyboard shortcut Ctrl+S for notes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        if (activeTab === "notes" && activeNote) {
          e.preventDefault();
          handleSaveNote();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, activeNote, noteTitle, noteContent]);

  // Poll processing papers
  useEffect(() => {
    const hasProcessing = papers.some(p => p.status === "processing" || p.status === "uploading");
    if (!hasProcessing) return;

    const interval = setInterval(async () => {
      try {
        fetchPapers(projectId);
      } catch (err) {
        console.error("Failed to poll papers:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [papers, projectId]);

  // Note handler methods
  const handleCreateNote = async () => {
    try {
      await createNote(projectId, { title: "Untitled Note", content: "" });
      setNoteSaveStatus("saved");
      fetchActivities();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    setNoteSaving(true);
    setNoteSaveStatus("saving");
    try {
      await saveNote(activeNote._id, {
        title: noteTitle,
        content: noteContent,
        paper: notePaperId === "" ? null : notePaperId
      });
      setNoteSaveStatus("saved");
      fetchActivities();
    } catch (error) {
      console.error("Failed to save note:", error);
      setNoteSaveStatus("unsaved");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        fetchActivities();
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  // Paper handler methods
  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      await uploadPaper(projectId, selectedFile, uploadTitle.trim() || selectedFile.name);
      setSelectedFile(null);
      setUploadTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPapers(projectId);
      fetchActivities();
    } catch (error) {
      console.error("Failed to upload paper:", error);
      alert(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePaper = async (id) => {
    if (confirm("Are you sure you want to delete this paper?")) {
      try {
        await deletePaper(id);
        fetchActivities();
      } catch (error) {
        console.error("Failed to delete paper:", error);
      }
    }
  };

  // Settings handlers
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await updateProject(projectId, {
        title: settingsTitle,
        description: settingsDesc,
        color: settingsColor,
        icon: settingsIcon,
      });
      // Refresh local project view
      setProject(prev => ({
        ...prev,
        title: settingsTitle,
        description: settingsDesc,
        color: settingsColor,
        icon: settingsIcon
      }));
      alert("Settings updated successfully!");
      fetchActivities();
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Failed to update settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (confirm("WARNING: Are you absolutely sure you want to delete this project? This will delete all papers, notes, and activity history and cannot be undone.")) {
      try {
        await deleteProject(projectId);
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project");
      }
    }
  };

  // Global search handler
  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await searchWorkspace(projectId, val);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Failed search:", err);
    } finally {
      setSearching(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Sub-sidebar for Workspace Section Navigation */}
      <aside className="w-56 border-r border-border bg-card flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          <div className="px-2 py-1.5 flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-accent shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">{project?.title}</h2>
              <p className="text-xs text-muted-foreground truncate">{project?.description || "No description"}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "overview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Info className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("papers")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "papers" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Papers
              </div>
              {papers.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {papers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "notes" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </div>
              {notes.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {notes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "insights" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Insights
            </button>
            <button
              onClick={() => setActiveTab("graph")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "graph" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Network className="w-4 h-4" />
              Knowledge Graph
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "settings" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>

        {/* Local Workspace Search */}
        <div className="relative mt-auto pt-4 border-t border-border">
          <Search className="absolute left-2.5 bottom-6 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workspace..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-8 pr-2 py-1.5 border border-border rounded-md bg-secondary/50 text-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-transparent text-xs"
          />
        </div>
      </aside>

      {/* Main Workspace Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* If search query has value, override normal tab render and show search results */}
        {searchQuery.trim() ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Workspace Search Results</h2>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-accent hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            </div>
            {searching ? (
              <div className="flex justify-center py-10">
                <Loader className="w-6 h-6 text-accent animate-spin" />
              </div>
            ) : searchResults && (searchResults.papers.length > 0 || searchResults.notes.length > 0) ? (
              <div className="space-y-6">
                {searchResults.papers.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Papers</h3>
                    <div className="grid gap-3">
                      {searchResults.papers.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => {
                            setActivePaper(p);
                            setActiveTab("papers");
                            setSearchQuery("");
                          }}
                          className="p-3 border border-border rounded-lg bg-card hover:border-accent cursor-pointer transition-colors"
                        >
                          <h4 className="text-sm font-medium text-foreground">{p.title}</h4>
                          {p.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.summary}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.notes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Notes</h3>
                    <div className="grid gap-3">
                      {searchResults.notes.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => {
                            setActiveNote(n);
                            setActiveTab("notes");
                            setSearchQuery("");
                          }}
                          className="p-3 border border-border rounded-lg bg-card hover:border-accent cursor-pointer transition-colors"
                        >
                          <h4 className="text-sm font-medium text-foreground">{n.title}</h4>
                          {n.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-10 text-center">No matching papers or notes found.</p>
            )}
          </div>
        ) : (
          /* normal tab navigation content */
          <>
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">Workspace Overview</h1>
                  <p className="text-base text-muted-foreground mt-1">Here is a summary of actions and status in this workspace.</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border border-border rounded-xl bg-card">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Papers</h3>
                    <p className="text-3xl font-bold text-foreground mt-2">{papers.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {papers.filter(p => p.status === "ready").length} Analyzed successfully
                    </p>
                  </div>
                  <div className="p-6 border border-border rounded-xl bg-card">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</h3>
                    <p className="text-3xl font-bold text-foreground mt-2">{notes.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Written in plain text & saved</p>
                  </div>
                  <div className="p-6 border border-border rounded-xl bg-card">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className={`w-2 h-2 rounded-full ${papers.some(p => p.status === "processing") ? "bg-yellow-500 animate-pulse" : "bg-emerald-500"}`} />
                      <span className="text-lg font-bold text-foreground">
                        {papers.some(p => p.status === "processing") ? "AI Processing..." : "Ready"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Background parser health</p>
                  </div>
                </div>

                {/* Activities Timeline */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Workspace Timeline</h2>
                  {activities.length === 0 ? (
                    <div className="p-8 border border-border border-dashed rounded-xl bg-card/25 text-center text-sm text-muted-foreground">
                      No activities logged yet. Upload papers or create notes to populate the timeline.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((act) => (
                        <div key={act._id} className="flex gap-4 p-4 border border-border rounded-lg bg-card items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            act.type === "PROJECT_CREATED" ? "bg-emerald-500" :
                            act.type === "PAPER_UPLOADED" ? "bg-blue-500" :
                            act.type === "NOTE_CREATED" ? "bg-amber-500" : "bg-purple-500"
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{act.message}</p>
                            <span className="text-xs text-muted-foreground block mt-1">
                              {new Date(act.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PAPERS */}
            {activeTab === "papers" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload & List Column */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">Papers & Literature</h2>
                    <p className="text-sm text-muted-foreground mt-1">Upload and review PDFs. Text will be extracted and summarized in the background.</p>
                  </div>

                  {/* PDF Upload form */}
                  <form onSubmit={handleUploadFile} className="p-6 border border-dashed border-border rounded-xl bg-card/20 space-y-4">
                    <div className="flex flex-col items-center justify-center border border-border rounded-lg p-6 bg-card cursor-pointer hover:border-accent/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-foreground font-medium">
                        {selectedFile ? selectedFile.name : "Select PDF Document"}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">PDF Files only (Max 10MB)</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="hidden"
                      />
                    </div>

                    {selectedFile && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Custom Title (Optional)</label>
                          <input
                            type="text"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            placeholder={selectedFile.name.replace(".pdf", "")}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => { setSelectedFile(null); setUploadTitle(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={uploading}
                            className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground font-medium text-xs hover:bg-accent/90 cursor-pointer flex items-center gap-1.5"
                          >
                            {uploading && <Loader className="w-3 h-3 animate-spin" />}
                            {uploading ? "Uploading..." : "Upload Paper"}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>

                  {/* Papers List */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Library ({papers.length})</h3>
                    {papers.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">No papers uploaded yet.</p>
                    ) : (
                      <div className="grid gap-3">
                        {papers.map((paper) => (
                          <div
                            key={paper._id}
                            onClick={() => setActivePaper(paper)}
                            className={`p-4 border rounded-xl bg-card flex items-center justify-between cursor-pointer transition-colors ${
                              activePaper?._id === paper._id ? "border-accent" : "border-border hover:border-border-accent"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <File className="w-6 h-6 text-accent shrink-0" />
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-foreground truncate">{paper.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {(paper.fileSize / (1024 * 1024)).toFixed(2)} MB
                                  </span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  {paper.status === "processing" ? (
                                    <span className="text-xs font-medium text-yellow-500 flex items-center gap-1">
                                      <Loader className="w-3 h-3 animate-spin" /> Processing AI Summary...
                                    </span>
                                  ) : paper.status === "ready" ? (
                                    <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" /> Ready
                                    </span>
                                  ) : (
                                    <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" /> Synthesis Failed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeletePaper(paper._id); }}
                              className="text-muted-foreground hover:text-red-500 p-2 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Paper detail/preview panel */}
                <div className="border border-border rounded-xl bg-card p-6 self-start space-y-6 max-h-[calc(100vh-170px)] overflow-y-auto w-full">
                  {activePaper ? (
                    <>
                      <div>
                        <div className="flex flex-wrap gap-2 items-center mb-1.5">
                          <span className="text-[9px] bg-accent/15 border border-accent/25 px-2 py-0.5 rounded-full text-accent font-semibold uppercase tracking-wider">
                            {activePaper.paperType || "Research Paper"}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-foreground break-all">{activePaper.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 break-all">Original Name: {activePaper.originalName}</p>
                      </div>

                      {activePaper.status === "processing" ? (
                        <div className="border border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
                          <Loader className="w-6 h-6 text-accent animate-spin mx-auto mb-2" />
                          Running Gemini synthesis extraction...
                        </div>
                      ) : activePaper.status === "ready" ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Paper Summary</h4>
                            <p className="text-sm text-foreground mt-1.5 leading-relaxed whitespace-pre-line break-words">{activePaper.summary}</p>
                          </div>

                          {activePaper.keyFindings?.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Findings</h4>
                              <ul className="list-disc pl-4 text-sm text-foreground mt-1.5 space-y-1">
                                {activePaper.keyFindings.map((kf, i) => (
                                  <li key={i}>{kf}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {activePaper.concepts?.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extracted Concepts</h4>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {activePaper.concepts.map((concept, i) => (
                                  <span key={i} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <a
                            href={`http://localhost:5000/uploads/${activePaper.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                          >
                            Open Original PDF
                          </a>
                        </div>
                      ) : (
                        <div className="border border-dashed border-red-200 rounded-lg p-6 text-center text-sm text-red-700 bg-red-50/20">
                          <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                          Failed to parse this document. Ensure it contains text.
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20 text-sm text-muted-foreground">
                      Select a paper from the list to preview metadata and AI summaries.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: NOTES */}
            {activeTab === "notes" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-140px)]">
                {/* Notes List Sidebar */}
                <div className="lg:col-span-1 border-r border-border pr-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">Project Notes</h3>
                      <button
                        onClick={handleCreateNote}
                        className="text-muted-foreground hover:text-accent p-1 cursor-pointer"
                        title="New Note"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                      {notes.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4">No notes created. Click '+' to make one.</p>
                      ) : (
                        notes.map((note) => (
                          <div
                            key={note._id}
                            onClick={() => setActiveNote(note)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors text-left relative group ${
                              activeNote?._id === note._id
                                ? "bg-secondary/80 border-accent"
                                : "border-border hover:bg-secondary/35"
                            }`}
                          >
                            <h4 className="text-xs font-semibold text-foreground truncate pr-6">{note.title}</h4>
                            <p className="text-[10px] text-muted-foreground mt-1 truncate">{note.content || "Empty content"}</p>
                            {note.paper?.title && (
                              <div className="mt-1.5 flex items-center">
                                <span className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground truncate max-w-full block">
                                  📄 {note.paper.title}
                                </span>
                              </div>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}
                              className="absolute right-2 top-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes Editor area */}
                <div className="lg:col-span-3 flex flex-col h-full">
                  {activeNote ? (
                    <div className="flex-1 flex flex-col space-y-4">
                      {/* Editor Title and Status Controls */}
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <input
                          type="text"
                          value={noteTitle}
                          onChange={(e) => { setNoteTitle(e.target.value); setNoteSaveStatus("unsaved"); }}
                          className="text-lg font-bold text-foreground bg-transparent border-none focus:outline-none w-full"
                          placeholder="Note Title"
                        />
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {noteSaveStatus === "saving" && "Saving..."}
                            {noteSaveStatus === "saved" && "Saved (Ctrl+S)"}
                            {noteSaveStatus === "unsaved" && "Unsaved changes"}
                          </span>
                          <button
                            onClick={handleSaveNote}
                            disabled={noteSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground font-medium text-xs hover:bg-accent/90 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Link to Paper selection dropdown */}
                      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                        <span className="text-xs font-medium text-muted-foreground">Link to Paper:</span>
                        <select
                          value={notePaperId}
                          onChange={(e) => { setNotePaperId(e.target.value); setNoteSaveStatus("unsaved"); }}
                          className="text-xs rounded-lg border border-border bg-card text-foreground px-2.5 py-1 focus:border-accent focus:outline-none transition-colors max-w-sm truncate"
                        >
                          <option value="">-- None --</option>
                          {papers.map(p => (
                            <option key={p._id} value={p._id}>{p.title}</option>
                          ))}
                        </select>
                      </div>

                      {/* Plain Text editor */}
                      <textarea
                        value={noteContent}
                        onChange={(e) => { setNoteContent(e.target.value); setNoteSaveStatus("unsaved"); }}
                        className="w-full flex-1 p-4 border border-border rounded-lg bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent resize-none h-[calc(100vh-270px)]"
                        placeholder="Write note contents in markdown or plain text here..."
                      />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                      Select or create a note in the sidebar list to start writing.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: AI INSIGHTS */}
            {activeTab === "insights" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">AI Research Insights</h2>
                  <p className="text-sm text-muted-foreground mt-1">Cross-paper synthesis powered by Gemini. We analyze contradictions and suggest research gaps.</p>
                </div>

                {insightsLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : insights ? (
                  <div className="space-y-6">
                    {/* Project Synthesis Summary */}
                    {insights.summary && (
                      <div className="p-6 border border-border rounded-xl bg-gradient-to-br from-card to-secondary/15 space-y-3">
                        <div className="flex items-center gap-2 text-accent">
                          <BookOpen className="w-5 h-5" />
                          <h3 className="text-base font-semibold text-foreground">Project Synthesis Summary</h3>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                          {insights.summary}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contradictions Box */}
                    <div className="p-6 border border-border rounded-xl bg-card space-y-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="text-base font-semibold text-foreground">Contradictions Detected</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">Conflicting arguments or differing results identified across papers.</p>
                      
                      {insights.contradictions?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No contradictions detected across your papers.</p>
                      ) : (
                        <div className="space-y-4">
                          {insights.contradictions?.map((contradiction, i) => (
                            <div key={i} className="p-4 rounded-lg bg-secondary/35 border border-border">
                              <h4 className="text-xs font-semibold text-foreground break-words">{contradiction.claim}</h4>
                              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed break-words">{contradiction.description}</p>
                              {contradiction.papers?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5 items-center max-w-full overflow-hidden">
                                  <span className="text-[10px] text-muted-foreground">Sources:</span>
                                  {contradiction.papers.map((p, idx) => (
                                    <span key={idx} className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono truncate max-w-xs inline-block" title={p}>
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Research Gaps Box */}
                    <div className="p-6 border border-border rounded-xl bg-card space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        <h3 className="text-base font-semibold text-foreground">Identified Research Gaps</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">Unexplored fields or missing links suggested by AI analysis.</p>

                      {insights.gaps?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No research gaps identified. Add more papers to enable deep synthesis.</p>
                      ) : (
                        <div className="space-y-4">
                          {insights.gaps?.map((gap, i) => (
                            <div key={i} className="p-4 rounded-lg bg-secondary/35 border border-border">
                              <h4 className="text-xs font-semibold text-foreground break-words">{gap.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed break-words">{gap.description}</p>
                              {gap.relevance && (
                                <span className="text-[10px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent block mt-2 w-max font-medium">
                                  Relevance: {gap.relevance}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comparative Technical Vocabulary */}
                  <div className="p-6 border border-border rounded-xl bg-card space-y-4">
                    <div className="flex items-center gap-2 text-accent">
                      <BookOpen className="w-5 h-5" />
                      <h3 className="text-base font-semibold text-foreground">Cross-Paper Technical Vocabulary</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Overlap and distinction in methodologies, algorithms, and key metrics across your uploaded research.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Shared Keywords */}
                      <div className="p-4 rounded-lg bg-secondary/25 border border-border space-y-2">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">Shared Methodologies & Keywords</h4>
                        {insights.sharedKeywords && insights.sharedKeywords.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {insights.sharedKeywords.map((kw, idx) => (
                              <span key={idx} className="text-[10px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground pt-1 italic">No shared technical terms detected across papers yet.</p>
                        )}
                      </div>

                      {/* Distinct Keywords */}
                      <div className="p-4 rounded-lg bg-secondary/25 border border-border space-y-2">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">Distinct Terms per Paper</h4>
                        {insights.distinctKeywords && insights.distinctKeywords.length > 0 ? (
                          <div className="space-y-3 pt-1">
                            {insights.distinctKeywords.map((dk, idx) => (
                              <div key={idx} className="space-y-1">
                                <span className="text-[10px] font-mono text-muted-foreground block truncate max-w-xs" title={dk.paper}>
                                  {dk.paper}
                                </span>
                                {dk.keywords && dk.keywords.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {dk.keywords.map((kw, kidx) => (
                                      <span key={kidx} className="text-[9px] bg-secondary border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-muted-foreground italic block">No unique technical terms.</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground pt-1 italic">No paper-specific concepts calculated.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="border border-dashed border-border rounded-xl p-12 text-center text-sm text-muted-foreground bg-card/20">
                    Upload papers first to trigger AI insights across your reading list.
                  </div>
                )}
              </div>
            )}

            {/* TAB: GRAPH */}
            {activeTab === "graph" && (
              <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Knowledge Graph</h2>
                  <p className="text-sm text-muted-foreground mt-1">Visual map connecting uploaded papers (blue nodes) and key extracted concepts (purple nodes).</p>
                </div>
                <div className="flex-1 border border-border rounded-xl bg-card relative overflow-hidden h-[450px]">
                  <KnowledgeGraph projectId={projectId} />
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className="max-w-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Project Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">Configure project layout styling, names, or permanently delete the workspace.</p>
                </div>

                <form onSubmit={handleUpdateSettings} className="space-y-4 border border-border p-6 rounded-xl bg-card">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      value={settingsTitle}
                      onChange={(e) => setSettingsTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                    <textarea
                      value={settingsDesc}
                      onChange={(e) => setSettingsDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Color Palette</label>
                    <select
                      value={settingsColor}
                      onChange={(e) => setSettingsColor(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-accent text-sm cursor-pointer"
                    >
                      <option value="#2563eb">Blue</option>
                      <option value="#9333ea">Purple</option>
                      <option value="#16a34a">Green</option>
                      <option value="#dc2626">Red</option>
                      <option value="#ea580c">Orange</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/90 cursor-pointer"
                    >
                      {settingsSaving && <Loader className="w-4 h-4 animate-spin" />}
                      Save Settings
                    </button>
                  </div>
                </form>

                <div className="p-6 border border-red-500/20 rounded-xl bg-red-500/5 space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-red-500">Delete Project Workspace</h3>
                    <p className="text-xs text-muted-foreground mt-1">This operation is permanent. It will delete all notes, PDFs, and logged activities. You cannot reverse this action.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    Delete Workspace
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Workspace;
