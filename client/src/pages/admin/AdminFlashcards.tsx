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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Flashcard, Topic, insertFlashcardSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export function AdminFlashcards() {
  const { toast } = useToast();
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: flashcards = [], isLoading: isLoadingFlashcards } = useQuery<Flashcard[]>({
    queryKey: ['/api/flashcards'],
  });

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const form = useForm({
    resolver: zodResolver(insertFlashcardSchema),
    defaultValues: {
      headline: '',
      bullets: [],
      topicId: 0
    }
  });

  const resetForm = () => {
    form.reset({
      headline: '',
      bullets: [],
      topicId: 0
    });
    setEditingFlashcard(null);
    setImageFile(null);
  };

  const createFlashcardMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/admin/flashcards', {
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
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });
      toast({
        title: "Flashcard created",
        description: "The flashcard has been added successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create flashcard",
        variant: "destructive"
      });
    }
  });

  const updateFlashcardMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FormData }) => {
      const res = await fetch(`/api/admin/flashcards/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });
      toast({
        title: "Flashcard updated",
        description: "The flashcard has been updated successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update flashcard",
        variant: "destructive"
      });
    }
  });

  const deleteFlashcardMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/flashcards/${id}`);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcards'] });
      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete flashcard",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append('headline', values.headline);
    
    // Handle bullets as array or stringify if needed
    if (Array.isArray(values.bullets)) {
      formData.append('bullets', JSON.stringify(values.bullets));
    } else if (typeof values.bullets === 'string') {
      // Handle case where it might be a comma-separated string
      const bulletsArray = values.bullets.split(',').map((b: string) => b.trim()).filter(Boolean);
      formData.append('bullets', JSON.stringify(bulletsArray));
    } else {
      formData.append('bullets', '[]');
    }
    
    formData.append('topicId', values.topicId?.toString() || '0');
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (editingFlashcard) {
      updateFlashcardMutation.mutate({ id: editingFlashcard.id, data: formData });
    } else {
      createFlashcardMutation.mutate(formData);
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    const bullets = Array.isArray(flashcard.bullets) 
      ? flashcard.bullets 
      : typeof flashcard.bullets === 'string'
        ? JSON.parse(flashcard.bullets)
        : [];
        
    form.reset({
      headline: flashcard.headline,
      bullets: bullets,
      topicId: flashcard.topicId
    });
    setEditingFlashcard(flashcard);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcardMutation.mutate(id);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const isLoading = isLoadingFlashcards || isLoadingTopics;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Flashcards</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Flashcard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFlashcard ? 'Edit Flashcard' : 'Add New Flashcard'}</DialogTitle>
              <DialogDescription>
                {editingFlashcard 
                  ? 'Update the flashcard information below.' 
                  : 'Enter the details for the new flashcard.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="topicId">Topic</Label>
                <Select 
                  onValueChange={(value) => form.setValue('topicId', parseInt(value))}
                  defaultValue={editingFlashcard ? editingFlashcard.topicId.toString() : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map(topic => (
                      <SelectItem key={topic.id} value={topic.id.toString()}>
                        {topic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="headline">Headline (Question)</Label>
                <Textarea
                  id="headline"
                  {...form.register('headline')}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="bullets">Bullets (Points to Remember)</Label>
                <Textarea
                  id="bullets"
                  {...form.register('bullets')}
                  rows={4}
                  placeholder="Enter bullet points separated by commas"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter multiple bullet points separated by commas
                </p>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('imageUrl')?.click()}>
                    <FileImage className="h-4 w-4 mr-2" />
                    {imageFile ? 'Change Image' : 'Select Image'}
                  </Button>
                  {imageFile && <span className="text-sm truncate max-w-[200px]">{imageFile.name}</span>}
                  {!imageFile && editingFlashcard?.imageUrl && (
                    <span className="text-sm truncate max-w-[200px]">Current: {editingFlashcard.imageUrl.split('/').pop()}</span>
                  )}
                </div>
                <Input
                  id="imageUrl"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createFlashcardMutation.isPending || updateFlashcardMutation.isPending}
                >
                  {(createFlashcardMutation.isPending || updateFlashcardMutation.isPending) ? 'Saving...' : 'Save Flashcard'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center p-6">Loading flashcards...</div>
      ) : flashcards.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p>No flashcards found. Create your first flashcard to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Bullets</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flashcards.map((flashcard) => {
              const topic = topics.find(t => t.id === flashcard.topicId);
              // Parse bullets if they're stored as a string
              const bullets = Array.isArray(flashcard.bullets) 
                ? flashcard.bullets 
                : typeof flashcard.bullets === 'string'
                  ? JSON.parse(flashcard.bullets)
                  : [];
              return (
                <TableRow key={flashcard.id}>
                  <TableCell>{topic?.title || 'Unknown'}</TableCell>
                  <TableCell>{flashcard.headline}</TableCell>
                  <TableCell>
                    {bullets.length > 0 ? (
                      <ul className="list-disc list-inside text-sm">
                        {bullets.slice(0, 2).map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                        {bullets.length > 2 && <li>...</li>}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground text-sm">No bullets</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {flashcard.imageUrl ? (
                      <img 
                        src={flashcard.imageUrl} 
                        alt="Flashcard" 
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(flashcard)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(flashcard.id)}
                        disabled={deleteFlashcardMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}