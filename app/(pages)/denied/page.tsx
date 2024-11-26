import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Denied() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Adgang afvist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Du har ikke adgang til denne side.</p>
          <Link href="/">
            <Button variant="default">Tilbage</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}