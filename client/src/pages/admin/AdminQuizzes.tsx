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
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2, Plus, Minus, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QuizQuestion, Topic, insertQuizQuestionSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

const quizQuestionSchema = insertQuizQuestionSchema.extend({
  options: z.array(z.string()).min(2, "At least 2 options are required")
});

type QuizQuestionFormData = z.infer<typeof quizQuestionSchema>;

export function AdminQuizzes() {
  const { toast } = useToast();
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '']);

  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz/questions'],
  });

  const { data: topics = [], isLoading: isLoadingTopics } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const form = useForm<QuizQuestionFormData>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      question: '',
      options: ['', ''],
      correctIndex: 0,
      explanation: '',
      topicId: 0
    }
  });

  const resetForm = () => {
    form.reset({
      question: '',
      options: ['', ''],
      correctIndex: 0,
      explanation: '',
      topicId: 0
    });
    setOptions(['', '']);
    setEditingQuestion(null);
  };

  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/questions', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/questions'] });
      toast({
        title: "Question created",
        description: "The quiz question has been added successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create question",
        variant: "destructive"
      });
    }
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/questions/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/questions'] });
      toast({
        title: "Question updated",
        description: "The quiz question has been updated successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update question",
        variant: "destructive"
      });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/admin/questions/${id}`);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quiz/questions'] });
      toast({
        title: "Question deleted",
        description: "The quiz question has been deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: QuizQuestionFormData) => {
    // Filter out empty options
    const filteredOptions = options.filter(o => o.trim() !== '');
    
    if (filteredOptions.length < 2) {
      toast({
        title: "Error",
        description: "At least 2 options are required",
        variant: "destructive"
      });
      return;
    }

    const submitData = {
      ...values,
      options: filteredOptions,
      topicId: Number(values.topicId),
      correctIndex: Number(values.correctIndex)
    };

    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, data: submitData });
    } else {
      createQuestionMutation.mutate(submitData);
    }
  };

  const handleEdit = (question: QuizQuestion) => {
    const questionOptions = Array.isArray(question.options) 
      ? question.options 
      : typeof question.options === 'object' 
        ? Object.values(question.options) 
        : [];
    
    setOptions(questionOptions);
    
    form.reset({
      question: question.question,
      options: questionOptions,
      correctIndex: question.correctIndex,
      explanation: question.explanation || '',
      topicId: question.topicId
    });
    
    setEditingQuestion(question);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestionMutation.mutate(id);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast({
        title: "Error",
        description: "At least 2 options are required",
        variant: "destructive"
      });
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    // Update the correct index if needed
    const correctIndex = form.getValues('correctIndex');
    if (index === correctIndex) {
      form.setValue('correctIndex', 0);
    } else if (index < correctIndex) {
      form.setValue('correctIndex', correctIndex - 1);
    }
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === options.length - 1)
    ) {
      return;
    }
    
    const newOptions = [...options];
    const correctIndex = form.getValues('correctIndex');
    
    if (direction === 'up') {
      // Swap with the previous item
      [newOptions[index - 1], newOptions[index]] = [newOptions[index], newOptions[index - 1]];
      
      // Update correct index if needed
      if (correctIndex === index) {
        form.setValue('correctIndex', index - 1);
      } else if (correctIndex === index - 1) {
        form.setValue('correctIndex', index);
      }
    } else {
      // Swap with the next item
      [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
      
      // Update correct index if needed
      if (correctIndex === index) {
        form.setValue('correctIndex', index + 1);
      } else if (correctIndex === index + 1) {
        form.setValue('correctIndex', index);
      }
    }
    
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const isLoading = isLoadingQuestions || isLoadingTopics;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Quiz Questions</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
              <DialogDescription>
                {editingQuestion 
                  ? 'Update the quiz question information below.' 
                  : 'Enter the details for the new quiz question.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="topicId">Topic</Label>
                <Select 
                  onValueChange={(value) => form.setValue('topicId', parseInt(value))}
                  defaultValue={editingQuestion ? editingQuestion.topicId.toString() : undefined}
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
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  {...form.register('question')}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="outline"
                        onClick={() => moveOption(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="outline"
                        onClick={() => moveOption(index, 'down')}
                        disabled={index === options.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="outline"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-24">
                      <Button
                        type="button"
                        variant={form.getValues('correctIndex') === index ? "default" : "outline"}
                        onClick={() => form.setValue('correctIndex', index)}
                        className="w-full"
                      >
                        {form.getValues('correctIndex') === index ? "Correct" : "Mark Correct"}
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addOption} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  {...form.register('explanation')}
                  rows={2}
                  placeholder="Explain why the correct answer is correct (optional)"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                >
                  {(createQuestionMutation.isPending || updateQuestionMutation.isPending) ? 'Saving...' : 'Save Question'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center p-6">Loading quiz questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p>No quiz questions found. Create your first question to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((question) => {
            const topic = topics.find(t => t.id === question.topicId);
            const options = Array.isArray(question.options) 
              ? question.options 
              : typeof question.options === 'object' 
                ? Object.values(question.options) 
                : [];
            
            return (
              <Card key={question.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="line-clamp-2">{question.question}</span>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(question)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(question.id)}
                        disabled={deleteQuestionMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Topic: {topic?.title || 'Unknown'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded-md text-sm ${
                          index === question.correctIndex 
                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                            : 'bg-muted/50'
                        }`}
                      >
                        {index === question.correctIndex && (
                          <span className="font-semibold mr-1">✓</span>
                        )}
                        {option}
                      </div>
                    ))}
                    {question.explanation && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Explanation:</span> {question.explanation}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}