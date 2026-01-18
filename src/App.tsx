import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { BlogList } from './components/BlogList';
import { BlogDetail } from './components/BlogDetail';
import { CreateBlogForm } from './components/CreateBlogForm';
import { Dialog, DialogContent, DialogClose } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { PlusCircle, BookOpen } from 'lucide-react';
import type { Blog } from './types/blog';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function BlogApp() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">CA Monk Blog</h1>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Create Blog</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Blog List */}
          <div className="lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">Latest Articles</h2>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest trends in finance, accounting, and career growth
              </p>
            </div>
            <BlogList
              onSelectBlog={setSelectedBlog}
              selectedBlogId={selectedBlog?.id}
            />
          </div>

          {/* Right Panel - Blog Detail */}
          <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24">
            {selectedBlog ? (
              <BlogDetail blogId={selectedBlog.id} />
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <div className="text-center p-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Blog Selected</h3>
                  <p className="text-muted-foreground">
                    Select a blog from the list to view its details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Blog Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogClose onClick={() => setIsCreateDialogOpen(false)} />
          <CreateBlogForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlogApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
