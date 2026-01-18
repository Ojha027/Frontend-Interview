import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/blogApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import type { Blog } from '@/types/blog';

interface BlogListProps {
    onSelectBlog: (blog: Blog) => void;
    selectedBlogId?: string;
}

export function BlogList({ onSelectBlog, selectedBlogId }: BlogListProps) {
    const { data: blogs, isLoading, error } = useQuery({
        queryKey: ['blogs'],
        queryFn: blogApi.getBlogs,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="cursor-pointer">
                        <CardHeader>
                            <div className="flex gap-2 mb-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <CardTitle>Error Loading Blogs</CardTitle>
                    </div>
                    <CardDescription className="text-destructive">
                        {error instanceof Error ? error.message : 'Failed to load blogs'}
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!blogs || blogs.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Blogs Found</CardTitle>
                    <CardDescription>There are no blogs available at the moment.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {blogs.map((blog) => (
                <Card
                    key={blog.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${selectedBlogId === blog.id ? 'border-primary shadow-md' : ''
                        }`}
                    onClick={() => onSelectBlog(blog)}
                >
                    <CardHeader>
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {blog.category.map((cat) => (
                                <Badge key={cat} variant="secondary" className="text-xs">
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{blog.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            {new Date(blog.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
