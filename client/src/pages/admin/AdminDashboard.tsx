import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTopics } from "./AdminTopics";
import { AdminAudibles } from "./AdminAudibles";
import { AdminFlashcards } from "./AdminFlashcards";
import { AdminQuizzes } from "./AdminQuizzes";
import { AdminUsers } from "./AdminUsers";
import { useAuth } from "@/components/AuthProvider";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user?.name}. Manage your learning platform content here.
        </p>
      </div>

      <Tabs defaultValue="topics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="audibles">Audibles</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="topics" className="p-4 border rounded-md mt-2">
          <AdminTopics />
        </TabsContent>
        <TabsContent value="audibles" className="p-4 border rounded-md mt-2">
          <AdminAudibles />
        </TabsContent>
        <TabsContent value="flashcards" className="p-4 border rounded-md mt-2">
          <AdminFlashcards />
        </TabsContent>
        <TabsContent value="quizzes" className="p-4 border rounded-md mt-2">
          <AdminQuizzes />
        </TabsContent>
        <TabsContent value="users" className="p-4 border rounded-md mt-2">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}