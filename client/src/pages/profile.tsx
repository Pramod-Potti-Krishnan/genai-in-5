import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  // Mock user data - in the future, this will come from auth context
  const user = {
    name: "Demo User",
    email: "demo@example.com",
    joinDate: "April 2023",
    avatar: "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff"
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-16 h-16 rounded-full" 
          />
          <div>
            <CardTitle>{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Community Member</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 py-2">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>Joined {user.joinDate}</span>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="font-medium">Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                You've completed 12 audio lessons and 5 quizzes.
              </p>
              
              <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: "35%" }}
                ></div>
              </div>
              <p className="text-xs text-right text-muted-foreground">35% Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}