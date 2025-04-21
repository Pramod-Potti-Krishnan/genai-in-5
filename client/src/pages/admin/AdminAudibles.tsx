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
import { PlusCircle, Pencil, Trash2, FileAudio, FileImage, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Audible, Topic, insertAudibleSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { formatDuration } from "@/lib/utils";

export function AdminAudibles() {
  const { toast } = useToast();
  const [editingAudible, setEditingAudible] = useState<Audible | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const { data: audibles = [], isLoading: isLoadingAudibles } = useQuery<Audible[]>({
    queryKey: ['/api/audibles'],
  });

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const form = useForm({
    resolver: zodResolver(insertAudibleSchema),
    defaultValues: {
      title: '',
      summary: '',
      lengthSec: 0,
      topicId: 0
    }
  });

  const resetForm = () => {
    form.reset({
      title: '',
      summary: '',
      lengthSec: 0,
      topicId: 0
    });
    setEditingAudible(null);
    setAudioFile(null);
    setCoverImageFile(null);
  };

  const createAudibleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/admin/audibles', {
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
      queryClient.invalidateQueries({ queryKey: ['/api/audibles'] });
      toast({
        title: "Audible created",
        description: "The audible has been added successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create audible",
        variant: "destructive"
      });
    }
  });

  const updateAudibleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: FormData }) => {
      const res = await fetch(`/api/admin/audibles/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['/api/audibles'] });
      toast({
        title: "Audible updated",
        description: "The audible has been updated successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update audible",
        variant: "destructive"
      });
    }
  });

  const deleteAudibleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/audibles/${id}`);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/audibles'] });
      toast({
        title: "Audible deleted",
        description: "The audible has been deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete audible",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('summary', values.summary || '');
    formData.append('lengthSec', values.lengthSec?.toString() || '0');
    formData.append('topicId', values.topicId?.toString() || '0');
    
    if (audioFile) {
      formData.append('audio', audioFile);
    }
    
    if (coverImageFile) {
      formData.append('image', coverImageFile);
    }

    if (editingAudible) {
      updateAudibleMutation.mutate({ id: editingAudible.id, data: formData });
    } else {
      // Require audio file for new audibles
      if (!audioFile) {
        toast({
          title: "Error",
          description: "Please upload an audio file",
          variant: "destructive"
        });
        return;
      }
      createAudibleMutation.mutate(formData);
    }
  };

  const handleEdit = (audible: Audible) => {
    form.reset({
      title: audible.title,
      summary: audible.summary || '',
      lengthSec: audible.lengthSec || 0,
      topicId: audible.topicId
    });
    setEditingAudible(audible);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this audible?')) {
      deleteAudibleMutation.mutate(id);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAudioFile(file);
    
    // Auto-fill length from audio file metadata if possible
    if (file) {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        form.setValue('lengthSec', Math.round(audio.duration));
      };
      audio.src = URL.createObjectURL(file);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImageFile(file);
  };

  const isLoading = isLoadingAudibles || isLoadingTopics;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Audibles</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Audible
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAudible ? 'Edit Audible' : 'Add New Audible'}</DialogTitle>
              <DialogDescription>
                {editingAudible 
                  ? 'Update the audible information below.' 
                  : 'Enter the details for the new audible.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    error={form.formState.errors.title?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="topicId">Topic</Label>
                  <Select 
                    onValueChange={(value) => form.setValue('topicId', parseInt(value))}
                    defaultValue={editingAudible ? editingAudible.topicId.toString() : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map(topic => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  {...form.register('summary')}
                  error={form.formState.errors.summary?.message}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lengthSec">Length (seconds)</Label>
                  <Input
                    id="lengthSec"
                    type="number"
                    {...form.register('lengthSec', { valueAsNumber: true })}
                    error={form.formState.errors.lengthSec?.message}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="audioFile">Audio File</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('audioFile')?.click()}>
                      <FileAudio className="h-4 w-4 mr-2" />
                      {audioFile ? 'Change Audio' : 'Select Audio'}
                    </Button>
                    {audioFile && <span className="text-sm truncate max-w-[200px]">{audioFile.name}</span>}
                    {!audioFile && editingAudible?.audioUrl && (
                      <span className="text-sm truncate max-w-[200px]">Current: {editingAudible.audioUrl.split('/').pop()}</span>
                    )}
                  </div>
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudioFileChange}
                  />
                  {!editingAudible && !audioFile && (
                    <p className="text-sm text-destructive mt-1">Audio file is required for new audibles</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('coverImage')?.click()}>
                      <FileImage className="h-4 w-4 mr-2" />
                      {coverImageFile ? 'Change Image' : 'Select Image'}
                    </Button>
                    {coverImageFile && <span className="text-sm truncate max-w-[200px]">{coverImageFile.name}</span>}
                    {!coverImageFile && editingAudible?.coverImage && (
                      <span className="text-sm truncate max-w-[200px]">Current: {editingAudible.coverImage.split('/').pop()}</span>
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
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createAudibleMutation.isPending || updateAudibleMutation.isPending}
                >
                  {(createAudibleMutation.isPending || updateAudibleMutation.isPending) ? 'Saving...' : 'Save Audible'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center p-6">Loading audibles...</div>
      ) : audibles.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p>No audibles found. Create your first audible to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audibles.map((audible) => {
              const topic = topics.find(t => t.id === audible.topicId);
              return (
                <TableRow key={audible.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {audible.coverImage && (
                        <img 
                          src={audible.coverImage} 
                          alt={audible.title} 
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                      <span>{audible.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{topic?.name || 'Unknown'}</TableCell>
                  <TableCell>{formatDuration(audible.lengthSec)}</TableCell>
                  <TableCell>
                    {audible.audioUrl && (
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={audible.audioUrl} target="_blank" rel="noopener noreferrer">
                            <Play className="h-4 w-4 mr-1" />
                            Preview
                          </a>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(audible)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(audible.id)}
                        disabled={deleteAudibleMutation.isPending}
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