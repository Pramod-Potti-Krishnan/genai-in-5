import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Topic, insertTopicSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

// Extend the insertTopicSchema with additional fields for admin form
const topicFormSchema = insertTopicSchema.extend({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional()
});

export function AdminTopics() {
  const { toast } = useToast();
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const form = useForm<z.infer<typeof topicFormSchema>>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      title: '',
      description: '',
      color: '',
      icon: ''
    }
  });

  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      color: '',
      icon: ''
    });
    setEditingTopic(null);
    setImageFile(null);
    setIconFile(null);
  };

  const createTopicMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/admin/topics', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/topics'] });
      toast({
        title: "Topic created",
        description: "The topic has been added successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create topic",
        variant: "destructive"
      });
    }
  });

  const updateTopicMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FormData }) => {
      const res = await fetch(`/api/admin/topics/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include'
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/topics'] });
      toast({
        title: "Topic updated",
        description: "The topic has been updated successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update topic",
        variant: "destructive"
      });
    }
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/topics/${id}`);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/topics'] });
      toast({
        title: "Topic deleted",
        description: "The topic has been deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete topic",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: z.infer<typeof topicFormSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    
    if (values.description) {
      formData.append('description', values.description);
    }
    
    if (values.color) {
      formData.append('color', values.color);
    }
    
    if (imageFile) {
      formData.append('coverImage', imageFile);
    }
    
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    if (editingTopic) {
      updateTopicMutation.mutate({ id: editingTopic.id, data: formData });
    } else {
      createTopicMutation.mutate(formData);
    }
  };

  const handleEdit = (topic: Topic) => {
    form.reset({
      title: topic.title,
      description: topic.description || '',
      color: topic.color || '',
      icon: topic.icon || ''
    });
    setEditingTopic(topic);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this topic? All associated content will also be deleted.')) {
      deleteTopicMutation.mutate(id);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Topics</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
              <DialogDescription>
                {editingTopic 
                  ? 'Update the topic information below.' 
                  : 'Enter the details for the new topic.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter topic title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter topic description (optional)" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color (HEX code)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="#RRGGBB" 
                            {...field} 
                            value={field.value || ''} 
                          />
                          {field.value && (
                            <div 
                              className="w-10 h-10 rounded-md border" 
                              style={{ backgroundColor: field.value }}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('coverImage')?.click()}>
                      <FileImage className="h-4 w-4 mr-2" />
                      {imageFile ? 'Change Image' : 'Select Image'}
                    </Button>
                    {imageFile && <span className="text-sm truncate max-w-[200px]">{imageFile.name}</span>}
                    {!imageFile && editingTopic?.coverImage && (
                      <span className="text-sm truncate max-w-[200px]">Current: {editingTopic.coverImage}</span>
                    )}
                  </div>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">Icon Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('icon')?.click()}>
                      <FileImage className="h-4 w-4 mr-2" />
                      {iconFile ? 'Change Icon' : 'Select Icon'}
                    </Button>
                    {iconFile && <span className="text-sm truncate max-w-[200px]">{iconFile.name}</span>}
                    {!iconFile && editingTopic?.icon && (
                      <span className="text-sm truncate max-w-[200px]">Current: {editingTopic.icon}</span>
                    )}
                  </div>
                  <Input
                    id="icon"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIconFileChange}
                  />
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={createTopicMutation.isPending || updateTopicMutation.isPending}
                  >
                    {(createTopicMutation.isPending || updateTopicMutation.isPending) 
                      ? 'Saving...' 
                      : 'Save Topic'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center p-6">Loading topics...</div>
      ) : topics.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p>No topics found. Create your first topic to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Cover</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.title}</TableCell>
                <TableCell className="max-w-xs truncate">{topic.description || 'N/A'}</TableCell>
                <TableCell>
                  {topic.color ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: topic.color }} />
                      <span>{topic.color}</span>
                    </div>
                  ) : (
                    'Default'
                  )}
                </TableCell>
                <TableCell>
                  {topic.icon ? (
                    <img 
                      src={topic.icon} 
                      alt={`${topic.title} icon`} 
                      className="h-8 w-8 object-contain" 
                    />
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {topic.coverImage ? (
                    <img 
                      src={topic.coverImage} 
                      alt={`${topic.title} cover`} 
                      className="h-12 w-20 object-cover rounded" 
                    />
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(topic.id)}
                      disabled={deleteTopicMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}