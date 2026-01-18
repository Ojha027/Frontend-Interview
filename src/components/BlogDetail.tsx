import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/blogApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Calendar } from 'lucide-react';

interface BlogDetailProps {
    blogId: string;
}

export function BlogDetail({ blogId }: BlogDetailProps) {
    const { data: blog, isLoading, error } = useQuery({
        queryKey: ['blog', blogId],
        queryFn: () => blogApi.getBlogById(blogId),
        enabled: !!blogId,
    });

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <Skeleton className="h-64 w-full mb-4 rounded-lg" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <div className="flex gap-2 mb-4">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive h-full">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <CardTitle>Error Loading Blog</CardTitle>
                    </div>
                    <CardContent>
                        <p className="text-destructive">
                            {error instanceof Error ? error.message : 'Failed to load blog'}
                        </p>
                    </CardContent>
                </CardHeader>
            </Card>
        );
    }

    if (!blog) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Select a blog to view</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <Card className="border-0 shadow-none">
                <CardHeader className="space-y-4">
                    {/* Cover Image */}
                    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Blog+Image';
                            }}
                        />
                    </div>

                    {/* Title */}
                    <CardTitle className="text-3xl md:text-4xl font-bold">{blog.title}</CardTitle>

                    {/* Category & Date */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex gap-2">
                            {blog.category.map((cat) => (
                                <Badge key={cat} variant="default" className="text-sm">
                                    {cat}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(blog.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-muted-foreground">{blog.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Content */}
                    <div className="prose prose-slate max-w-none">
                        {blog.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                                <p key={index} className="mb-4 text-foreground leading-relaxed">
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
