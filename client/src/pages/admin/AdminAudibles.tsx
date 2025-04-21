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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Pencil, Trash2, FileImage, AudioWaveform } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Audible, Topic, insertAudibleSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { formatDuration } from "@/lib/utils";

// Extend the insertAudibleSchema with additional fields for admin form
const audibleFormSchema = insertAudibleSchema.extend({
  title: z.string().min(2, "Title must be at least 2 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  lengthSec: z.coerce.number().min(1, "Length is required"),
  topicId: z.coerce.number().min(1, "Topic is required")
});

export function AdminAudibles() {
  const { toast } = useToast();
  const [editingAudible, setEditingAudible] = useState<Audible | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const { data: audibles = [], isLoading: isLoadingAudibles } = useQuery<Audible[]>({
    queryKey: ['/api/audibles'],
  });

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const form = useForm<z.infer<typeof audibleFormSchema>>({
    resolver: zodResolver(audibleFormSchema),
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
    setImageFile(null);
    setAudioFile(null);
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
        description: "The audio content has been added successfully"
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
        description: "The audio content has been updated successfully"
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
        description: "The audio content has been deleted successfully"
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

  const onSubmit = (values: z.infer<typeof audibleFormSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('summary', values.summary);
    formData.append('lengthSec', values.lengthSec.toString());
    formData.append('topicId', values.topicId.toString());
    
    if (imageFile) {
      formData.append('coverImage', imageFile);
    }
    
    if (audioFile) {
      formData.append('audio', audioFile);
    }

    if (editingAudible) {
      updateAudibleMutation.mutate({ id: editingAudible.id, data: formData });
    } else {
      createAudibleMutation.mutate(formData);
    }
  };

  const handleEdit = (audible: Audible) => {
    form.reset({
      title: audible.title,
      summary: audible.summary,
      lengthSec: audible.lengthSec,
      topicId: audible.topicId
    });
    setEditingAudible(audible);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this audio content?')) {
      deleteAudibleMutation.mutate(id);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAudioFile(file);
  };

  const isLoading = isLoadingAudibles || isLoadingTopics;

  // Extract time in seconds from an audio file
  const extractAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };
      audio.src = URL.createObjectURL(file);
    });
  };

  // Update length when audio file changes
  const updateAudioLength = async (file: File) => {
    try {
      const duration = await extractAudioDuration(file);
      form.setValue('lengthSec', Math.round(duration));
    } catch (error) {
      console.error('Failed to extract audio duration:', error);
    }
  };

  // Listen for audio file changes to update duration
  const handleAudioFileWithDuration = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAudioFile(file);
    if (file) {
      await updateAudioLength(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Audio Content</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Audio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAudible ? 'Edit Audio Content' : 'Add New Audio Content'}</DialogTitle>
              <DialogDescription>
                {editingAudible 
                  ? 'Update the audio content information below.' 
                  : 'Enter the details for the new audio content.'}
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
                        <Input placeholder="Enter audio title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="topicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value ? field.value.toString() : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {topics.map(topic => (
                            <SelectItem key={topic.id} value={topic.id.toString()}>
                              {topic.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a summary of the audio content" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Label htmlFor="audio">Audio File {editingAudible ? '(Leave empty to keep current)' : ''}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('audio')?.click()}>
                      <AudioWaveform className="h-4 w-4 mr-2" />
                      {audioFile ? 'Change Audio' : 'Select Audio File'}
                    </Button>
                    {audioFile && <span className="text-sm truncate max-w-[200px]">{audioFile.name}</span>}
                    {!audioFile && editingAudible?.audioUrl && (
                      <span className="text-sm truncate max-w-[200px]">Current: {editingAudible.audioUrl.split('/').pop()}</span>
                    )}
                  </div>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudioFileWithDuration}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="lengthSec"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (seconds)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          min={1}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Label htmlFor="coverImage">Cover Image {editingAudible ? '(Leave empty to keep current)' : ''}</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('coverImage')?.click()}>
                      <FileImage className="h-4 w-4 mr-2" />
                      {imageFile ? 'Change Image' : 'Select Image'}
                    </Button>
                    {imageFile && <span className="text-sm truncate max-w-[200px]">{imageFile.name}</span>}
                    {!imageFile && editingAudible?.coverImage && (
                      <span className="text-sm truncate max-w-[200px]">Current: {editingAudible.coverImage}</span>
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
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    disabled={createAudibleMutation.isPending || updateAudibleMutation.isPending}
                  >
                    {(createAudibleMutation.isPending || updateAudibleMutation.isPending) 
                      ? 'Saving...' 
                      : 'Save Audio'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center p-6">Loading audio content...</div>
      ) : audibles.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p>No audio content found. Create your first audio to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="w-[100px]">Duration</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audibles.map((audible) => {
              const topic = topics.find(t => t.id === audible.topicId);
              return (
                <TableRow key={audible.id}>
                  <TableCell>
                    {audible.coverImage ? (
                      <img 
                        src={audible.coverImage} 
                        alt={audible.title} 
                        className="h-12 w-12 object-cover rounded-md" 
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                        <AudioWaveform className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{audible.title}</TableCell>
                  <TableCell>{topic?.title || 'Unknown'}</TableCell>
                  <TableCell>{formatDuration(audible.lengthSec)}</TableCell>
                  <TableCell className="max-w-xs truncate">{audible.summary}</TableCell>
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