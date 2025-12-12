import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Twitter, Github, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";

export default function Community() {
  const navigate = useNavigate();

  const communityLinks = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Discord",
      description: "Join our Discord server for real-time discussions",
      link: "#",
      color: "text-blue-500"
    },
    {
      icon: <Twitter className="w-8 h-8" />,
      title: "Twitter",
      description: "Follow us for updates and announcements",
      link: "#",
      color: "text-sky-500"
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: "GitHub",
      description: "Contribute to our open-source codebase",
      link: "#",
      color: "text-gray-400"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Blog",
      description: "Read our latest articles and technical posts",
      link: "#",
      color: "text-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Community</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join the zkLiquidate community and connect with developers, liquidators, and DeFi enthusiasts
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {communityLinks.map((item, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className={item.color}>{item.icon}</div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => window.open(item.link, "_blank")}>
                    Visit {item.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our community is built on respect, collaboration, and innovation. We welcome developers, 
                liquidators, and anyone interested in advancing cross-chain DeFi.
              </p>
              <div>
                <h3 className="font-bold text-foreground mb-2">Code of Conduct</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Be respectful and inclusive</li>
                  <li>Share knowledge and help others</li>
                  <li>Provide constructive feedback</li>
                  <li>Report bugs and security issues responsibly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
