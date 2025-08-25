import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Page() {
  const session = await auth()

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">H</span>
            </div>
            <div>
              <CardTitle className="text-4xl font-bold mb-2">Welcome to Himay&apos;s Portfolio</CardTitle>
              <CardDescription className="text-lg">
                A collection of my personal projects and creative endeavors
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-base leading-relaxed">
              Hello! I&apos;m Himay, and this website showcases my personal projects and development journey.
              To explore my portfolio and see what I&apos;ve been working on, please log in to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">H</span>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold mb-2">Welcome back, {session.user?.name || 'User'}!</CardTitle>
            <CardDescription className="text-lg">
              Ready to explore my portfolio?
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-base leading-relaxed">
            Great to see you again! You now have access to all my personal projects and portfolio content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/bucketList">Explore Projects</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
