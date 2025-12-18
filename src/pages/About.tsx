import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Shield, Leaf, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Clock,
      title: 'Reduces Waiting Time',
      description: 'It helps people save their seats at a restaurant in advance and reduces waiting time.',
    },
    {
      icon: Shield,
      title: 'Safe & Hygienic',
      description: 'All our partner restaurants follow strict hygiene standards',
    },
    {
      icon: Leaf,
      title: 'Healthy Options',
      description: 'Wide variety of nutritious meals for health-conscious users',
    },
    {
      icon: Heart,
      title: 'Quality First',
      description: 'Only the best ingredients and preparation methods',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">About REZY</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your smart companion for discovering great food and seamless dining experiences
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-4">
                REZY was born from a simple idea: make food ordering and restaurant reservations 
                effortless and enjoyable. We believe that great food should be accessible to 
                everyone, anytime, anywhere.
              </p>
              <p className="text-lg text-muted-foreground">
                With our AI-powered platform, we connect food lovers with the best restaurants 
                in their area, ensuring every meal is a delightful experience. Whether you're 
                craving healthy options or indulgent treats, we've got you covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                To revolutionize the way people discover, order, and enjoy food by leveraging 
                technology to create seamless, personalized dining experiences that bring joy 
                to every meal.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Partner Restaurants</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
                  <p className="text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
