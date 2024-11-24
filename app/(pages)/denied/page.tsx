import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Denied() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You do not have permission to access this page.</p>
          <Link href="/">
            <Button variant="default">Back</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}