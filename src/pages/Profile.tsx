import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
    }
  }, [user, loading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    await updateProfile({ full_name: fullName });
    
    setIsUpdating(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">My Profile</h1>

            <div className="space-y-6">
              {/* Profile Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View and manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Mail className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{joinedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-medium text-xs">{user.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">0</p>
                      <p className="text-sm text-muted-foreground">Orders</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">0</p>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">0</p>
                      <p className="text-sm text-muted-foreground">Favorites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
