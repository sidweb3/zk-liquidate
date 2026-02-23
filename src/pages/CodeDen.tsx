import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code2, Download, Search, ChevronRight, ChevronDown, FileCode, FolderOpen, Folder, Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
import { zipSync, strToU8 } from "fflate";

// Use Vite's import.meta.glob to load all source files as raw strings
const _tsFiles = import.meta.glob("/src/**/*.ts", { as: "raw", eager: true });
const _tsxFiles = import.meta.glob("/src/**/*.tsx", { as: "raw", eager: true });
const _cssFiles = import.meta.glob("/src/**/*.css", { as: "raw", eager: true });
const allFiles: Record<string, string> = { ..._tsFiles, ..._tsxFiles, ..._cssFiles };

// All non-src files to fetch at download time (relative to project root, served from /)
const STATIC_FILES_TO_FETCH: string[] = [
  // Root config files
  "package.json",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "vercel.json",
  "convex.json",
  "components.json",
  "eslint.config.js",
  "index.html",
  // Contracts
  "contracts/IntentRegistryV2.sol",
  "contracts/LiquidationExecutorV2.sol",
  "contracts/ZKVerifier.sol",
  "contracts/IntentRegistry.sol",
  "contracts/LiquidationExecutor.sol",
  "contracts/DEPLOYMENT_V2.md",
  // Scripts
  "scripts/deploy-mumbai.ts",
  "scripts/deploy-zkevm.ts",
  "scripts/test-flow-v2.ts",
  "scripts/test-flow.ts",
  // Docs
  "README.md",
  "FINAL_DEPLOYMENT.md",
  "DOCUMENTATION_INDEX.md",
  "HOW_TO_VERIFY_PROOFS.md",
  "PLONKY2_IMPLEMENTATION_GUIDE.md",
  "TEST_LIQUIDATION_GUIDE.md",
  "V2_CONTRACTS_CODE.md",
  "VERIFICATION_GUIDE.md",
  "WAVE_5_DEPLOYMENT_COMPLETE.md",
  "WAVE_5_JUDGE_RESPONSE.md",
  "WAVE_5_V2_SUMMARY.md",
  "ZK_VERIFICATION_CONFIRMATION.md",
  "integrations.md",
  "docs/BUG_BOUNTY.md",
  "docs/COMMUNITY_TESTING_GUIDE.md",
  "docs/DEPLOYMENT_GUIDE.md",
  "docs/REAL_WORLD_TESTING.md",
  "docs/WAVE_5_SUBMISSION.md",
  // Convex config
  "src/convex/tsconfig.json",
];

interface FileEntry {
  path: string;
  content: string;
  category: string;
  size: number;
}

function categorize(path: string): string {
  if (path.includes("/pages/")) return "Pages";
  if (path.includes("/components/dashboard/")) return "Dashboard Components";
  if (path.includes("/components/landing/")) return "Landing Components";
  if (path.includes("/components/whitepaper/")) return "Whitepaper Components";
  if (path.includes("/components/deployment/")) return "Deployment Components";
  if (path.includes("/components/ui/")) return "UI Library";
  if (path.includes("/components/")) return "Components";
  if (path.includes("/convex/")) return "Convex Backend";
  if (path.includes("/hooks/")) return "Hooks";
  if (path.includes("/lib/")) return "Libraries";
  if (path.includes("/types/")) return "Types";
  return "Other";
}

function getLanguage(path: string): string {
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".tsx")) return "tsx";
  return "ts";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function stripLeadingSlash(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path;
}

const CATEGORY_ORDER = [
  "Pages",
  "Dashboard Components",
  "Landing Components",
  "Whitepaper Components",
  "Deployment Components",
  "Convex Backend",
  "Hooks",
  "Libraries",
  "Types",
  "UI Library",
  "Components",
  "Other",
];

export default function CodeDen() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [grouped, setGrouped] = useState<Record<string, FileEntry[]>>({});
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const entries: FileEntry[] = Object.entries(allFiles)
      .filter(([path]) => !path.includes("/_generated/"))
      .map(([path, content]) => ({
        path: stripLeadingSlash(path),
        content: content as string,
        category: categorize(path),
        size: (content as string).length,
      }))
      .sort((a, b) => a.path.localeCompare(b.path));

    setFiles(entries);

    const g: Record<string, FileEntry[]> = {};
    for (const entry of entries) {
      if (!g[entry.category]) g[entry.category] = [];
      g[entry.category].push(entry);
    }
    setGrouped(g);

    const defaultOpen = new Set(
      CATEGORY_ORDER.filter((c) => c !== "UI Library" && g[c]?.length > 0).slice(0, 5)
    );
    setOpenCategories(defaultOpen);

    const first = entries.find((e) => e.category !== "UI Library");
    if (first) setSelectedFile(first);
  }, []);

  const filteredFiles = search.trim()
    ? files.filter(
        (f) =>
          f.path.toLowerCase().includes(search.toLowerCase()) ||
          f.content.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!selectedFile) return;
    const blob = new Blob([selectedFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedFile.path.split("/").pop() || "file.ts";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${a.download}`);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      toast.info("Building zip archive...");

      const zipEntries: Record<string, Uint8Array> = {};

      // 1. Add all glob-loaded src files
      for (const file of files) {
        // file.path is like "src/pages/CodeDen.tsx"
        const zipPath = `zk-cross-liquidate/${file.path}`;
        zipEntries[zipPath] = strToU8(file.content);
      }

      // 2. Fetch and add all static/config/contract files
      const fetchResults = await Promise.allSettled(
        STATIC_FILES_TO_FETCH.map(async (filePath) => {
          // Try fetching from the public root (Vite serves project root files via /)
          // For non-public files, we fall back gracefully
          const res = await fetch(`/${filePath}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const text = await res.text();
          return { path: filePath, content: text };
        })
      );

      for (const result of fetchResults) {
        if (result.status === "fulfilled") {
          const { path, content } = result.value;
          zipEntries[`zk-cross-liquidate/${path}`] = strToU8(content);
        }
        // silently skip files that couldn't be fetched (not in public/)
      }

      // 3. Create zip with fflate
      const zipped = zipSync(zipEntries, { level: 6 });
      const blob = new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zk-cross-liquidate.zip";
      a.click();
      URL.revokeObjectURL(url);

      const srcCount = files.length;
      const staticCount = fetchResults.filter((r) => r.status === "fulfilled").length;
      toast.success(`Downloaded zip with ${srcCount + staticCount} files!`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate zip");
    } finally {
      setDownloading(false);
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">CodeDen</span>
            <Badge variant="outline" className="text-xs">ZK Cross-Liquidate</Badge>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {files.length} files · {formatSize(totalSize)}
            </span>
            <Button
              size="sm"
              onClick={handleDownloadZip}
              disabled={downloading}
              className="bg-primary text-black hover:bg-primary/90 gap-2 h-8 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? "Preparing..." : "Download All"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* Sidebar */}
        <div className="w-64 border-r border-border/50 flex flex-col flex-shrink-0 bg-card/20 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-border/30 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-background/50 border-border/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {search.trim() ? (
                <div className="space-y-0.5">
                  {filteredFiles && filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <FileItem
                        key={file.path}
                        file={file}
                        selected={selectedFile?.path === file.path}
                        onClick={() => setSelectedFile(file)}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground px-2 py-4 text-center">No files found</p>
                  )}
                </div>
              ) : (
                CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0).map((cat) => (
                  <div key={cat} className="mb-1">
                    <button
                      onClick={() => toggleCategory(cat)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      {openCategories.has(cat) ? (
                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                      )}
                      {openCategories.has(cat) ? (
                        <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/60" />
                      )}
                      <span className="truncate">{cat}</span>
                      <span className="ml-auto text-[10px] opacity-50">{grouped[cat].length}</span>
                    </button>
                    <AnimatePresence>
                      {openCategories.has(cat) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 border-l border-border/30 pl-2 space-y-0.5 py-0.5">
                            {grouped[cat].map((file) => (
                              <FileItem
                                key={file.path}
                                file={file}
                                selected={selectedFile?.path === file.path}
                                onClick={() => setSelectedFile(file)}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedFile ? (
            <>
              {/* File header */}
              <div className="border-b border-border/50 px-4 py-2.5 flex items-center gap-3 bg-card/20 flex-shrink-0">
                <FileCode className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-mono text-sm text-foreground/80 truncate">{selectedFile.path}</span>
                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-[10px] h-5">
                    {getLanguage(selectedFile.path).toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatSize(selectedFile.size)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="h-7 text-xs px-2 gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadFile}
                    className="h-7 text-xs px-2 gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Code viewer - native overflow scroll, no ScrollArea */}
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-xs font-mono leading-relaxed text-foreground/85 whitespace-pre min-h-full">
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Code2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Select a file to view</p>
                <p className="text-sm mt-1">Browse the file tree on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileItem({
  file,
  selected,
  onClick,
}: {
  file: FileEntry;
  selected: boolean;
  onClick: () => void;
}) {
  const filename = file.path.split("/").pop() || file.path;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors text-left ${
        selected
          ? "bg-primary/15 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
      }`}
    >
      <FileCode className="w-3 h-3 flex-shrink-0 opacity-60" />
      <span className="truncate">{filename}</span>
    </button>
  );
}