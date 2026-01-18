import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '@/api/blogApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';
import type { CreateBlogInput } from '@/types/blog';

interface CreateBlogFormProps {
    onSuccess?: () => void;
}

export function CreateBlogForm({ onSuccess }: CreateBlogFormProps) {
    const [formData, setFormData] = useState<CreateBlogInput>({
        title: '',
        category: [],
        description: '',
        coverImage: '',
        content: '',
    });
    const [categoryInput, setCategoryInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: blogApi.createBlog,
        onSuccess: () => {
            // Invalidate and refetch blogs
            queryClient.invalidateQueries({ queryKey: ['blogs'] });

            // Show success message
            setShowSuccess(true);

            // Reset form
            setFormData({
                title: '',
                category: [],
                description: '',
                coverImage: '',
                content: '',
            });
            setCategoryInput('');

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
                onSuccess?.();
            }, 3000);
        },
    });

    const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && categoryInput.trim()) {
            e.preventDefault();
            const newCategory = categoryInput.trim().toUpperCase();
            if (!formData.category.includes(newCategory)) {
                setFormData({
                    ...formData,
                    category: [...formData.category, newCategory],
                });
            }
            setCategoryInput('');
        }
    };

    const handleRemoveCategory = (categoryToRemove: string) => {
        setFormData({
            ...formData,
            category: formData.category.filter((cat) => cat !== categoryToRemove),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title || !formData.description || !formData.content) {
            alert('Please fill in all required fields');
            return;
        }

        if (formData.category.length === 0) {
            alert('Please add at least one category');
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Create New Blog</CardTitle>
                <CardDescription>Fill in the details to create a new blog post</CardDescription>
            </CardHeader>
            <CardContent>
                {showSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Blog created successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="title"
                            placeholder="Enter blog title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">
                            Categories <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="category"
                            placeholder="Type a category and press Enter"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={handleAddCategory}
                        />
                        {formData.category.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.category.map((cat) => (
                                    <span
                                        key={cat}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                    >
                                        {cat}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(cat)}
                                            className="hover:bg-primary/20 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Enter a short description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>

                    {/* Cover Image URL */}
                    <div className="space-y-2">
                        <label htmlFor="coverImage" className="text-sm font-medium">
                            Cover Image URL
                        </label>
                        <Input
                            id="coverImage"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        />
                        {formData.coverImage && (
                            <div className="mt-2">
                                <img
                                    src={formData.coverImage}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                            Content <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                            id="content"
                            placeholder="Write your blog content here..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={12}
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {mutation.isError && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            {mutation.error instanceof Error ? mutation.error.message : 'Failed to create blog'}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <Button type="submit" disabled={mutation.isPending} className="flex-1">
                            {mutation.isPending ? 'Creating...' : 'Create Blog'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
