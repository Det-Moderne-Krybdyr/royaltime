import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignIn from "./sign-in";

export function LoginForm() {
    
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <SignIn/>
      </CardContent>
    </Card>
  );
}