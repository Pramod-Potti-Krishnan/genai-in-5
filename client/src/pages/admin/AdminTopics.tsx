import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function AdminTopics() {
  const { toast } = useToast();
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const form = useForm({
    resolver: zodResolver(insertTopicSchema),
    defaultValues: {
      name: '',
      description: '',
      orderIndex: 0,
      coverImage: ''
    }
  });

  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      orderIndex: 0,
      coverImage: ''
    });
    setEditingTopic(null);
    setCoverImageFile(null);
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

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description || '');
    formData.append('orderIndex', values.orderIndex?.toString() || '0');
    
    if (coverImageFile) {
      formData.append('image', coverImageFile);
    }

    if (editingTopic) {
      updateTopicMutation.mutate({ id: editingTopic.id, data: formData });
    } else {
      createTopicMutation.mutate(formData);
    }
  };

  const handleEdit = (topic: Topic) => {
    form.reset({
      name: topic.name,
      description: topic.description || '',
      orderIndex: topic.orderIndex || 0,
      coverImage: topic.coverImage || ''
    });
    setEditingTopic(topic);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      deleteTopicMutation.mutate(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImageFile(file);
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
              <DialogDescription>
                {editingTopic 
                  ? 'Update the topic information below.' 
                  : 'Enter the details for the new topic.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  error={form.formState.errors.name?.message}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  error={form.formState.errors.description?.message}
                />
              </div>
              <div>
                <Label htmlFor="orderIndex">Order (display position)</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  {...form.register('orderIndex', { valueAsNumber: true })}
                  error={form.formState.errors.orderIndex?.message}
                />
              </div>
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('coverImage')?.click()}>
                    <FileImage className="h-4 w-4 mr-2" />
                    {coverImageFile ? 'Change Image' : 'Select Image'}
                  </Button>
                  {coverImageFile && <span className="text-sm">{coverImageFile.name}</span>}
                  {!coverImageFile && editingTopic?.coverImage && (
                    <span className="text-sm">Current: {editingTopic.coverImage.split('/').pop()}</span>
                  )}
                </div>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
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
                  {(createTopicMutation.isPending || updateTopicMutation.isPending) ? 'Saving...' : 'Save Topic'}
                </Button>
              </DialogFooter>
            </form>
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Cover Image</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-medium">{topic.name}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>{topic.orderIndex}</TableCell>
                <TableCell>
                  {topic.coverImage ? (
                    <img 
                      src={topic.coverImage} 
                      alt={topic.name} 
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">No image</span>
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