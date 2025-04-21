import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Pencil, UserPlus, Shield, ShieldAlert, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  isAdmin: z.boolean().optional(),
  password: z.string().optional()
    .refine(pw => !pw || pw.length >= 6, {
      message: "Password must be at least 6 characters or empty to keep current password",
    }),
});

type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

const createUserSchema = userUpdateSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AdminUsers() {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const form = useForm<UserUpdateFormData>({
    resolver: zodResolver(isCreating ? createUserSchema : userUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
      isAdmin: false,
      password: ''
    }
  });

  const resetForm = () => {
    form.reset({
      name: '',
      email: '',
      isAdmin: false,
      password: ''
    });
    setEditingUser(null);
  };

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/users', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User created",
        description: "The user has been added successfully"
      });
      resetForm();
      setIsOpen(false);
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/users/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User updated",
        description: "The user has been updated successfully"
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async ({ id, isAdmin }: { id: number, isAdmin: boolean }) => {
      const res = await apiRequest('PATCH', `/api/admin/users/${id}/toggle-admin`, { isAdmin });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Admin status updated",
        description: "The user's admin status has been updated"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin status",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (values: UserUpdateFormData) => {
    const submitData = {
      ...values,
      // Don't send password if it's empty during update
      ...((!isCreating && !values.password) ? { password: undefined } : {})
    };

    if (isCreating) {
      createUserMutation.mutate(submitData);
    } else if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data: submitData });
    }
  };

  const handleAddUser = () => {
    resetForm();
    setIsCreating(true);
    setIsOpen(true);
  };

  const handleEdit = (user: User) => {
    form.reset({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,
      password: '' // Don't show the current password
    });
    setEditingUser(user);
    setIsCreating(false);
    setIsOpen(true);
  };

  const handleToggleAdmin = (user: User) => {
    toggleAdminMutation.mutate({ 
      id: user.id, 
      isAdmin: !(user.isAdmin || false)
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isCreating ? 'Create User' : 'Edit User'}</DialogTitle>
              <DialogDescription>
                {isCreating 
                  ? 'Enter the details for the new user.' 
                  : 'Update the user information below.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">
                  {isCreating ? 'Password' : 'New Password (leave empty to keep current)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="admin"
                  checked={form.watch('isAdmin')}
                  onCheckedChange={(checked) => form.setValue('isAdmin', checked)}
                />
                <Label htmlFor="admin">Admin Access</Label>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createUserMutation.isPending || updateUserMutation.isPending}
                >
                  {(createUserMutation.isPending || updateUserMutation.isPending) 
                    ? 'Saving...' 
                    : isCreating ? 'Create User' : 'Update User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center p-6">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/20">
          <p>No users found. Create your first user to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {user.avatarUrl && (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    )}
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {user.isAdmin ? (
                      <div className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Admin
                      </div>
                    ) : (
                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <UserCheck className="h-3 w-3 mr-1" />
                        User
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(user)}
                      title="Edit User"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleAdmin(user)}
                      title={user.isAdmin ? "Remove Admin Rights" : "Grant Admin Rights"}
                      disabled={toggleAdminMutation.isPending}
                    >
                      <Shield className={`h-4 w-4 ${user.isAdmin ? 'text-amber-500' : 'text-slate-500'}`} />
                      <span className="sr-only">
                        {user.isAdmin ? "Remove Admin Rights" : "Grant Admin Rights"}
                      </span>
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