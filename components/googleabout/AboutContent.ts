// components/googleabout/constants/aboutContent.ts
export const ABOUT_CONTENT = {
  hero: {
    tagline: "Empowering Businesses Worldwide",
    title: "Transform Your Business with Intelligent Management",
    subtitle: "Join thousands of companies using AccuManage to streamline operations, boost productivity, and drive growth."
  },
  
  mission: {
    title: "Our Mission",
    subtitle: "Empowering businesses through innovative technology",
    description: "To provide businesses of all sizes with powerful, intuitive management tools that simplify complex operations, foster collaboration, and drive sustainable growth in an increasingly digital world."
  },
  
  vision: {
    title: "Our Vision",
    subtitle: "Redefining business management for the modern era",
    description: "To create a world where every business, regardless of size, has access to enterprise-grade management solutions that are affordable, easy to use, and adapt to their unique needs."
  },
  
  values: {
    title: "Our Core Values",
    subtitle: "The principles that guide everything we do",
    items: [
      {
        title: "Innovation",
        description: "Constantly pushing boundaries to deliver cutting-edge solutions that solve real business problems."
      },
      {
        title: "Integrity",
        description: "Building trust through transparent practices, data security, and ethical business conduct."
      },
      {
        title: "Customer Success",
        description: "Your success is our success. We're committed to helping you achieve your business goals."
      },
      {
        title: "Excellence",
        description: "Striving for the highest quality in everything we do, from code to customer support."
      },
      {
        title: "Collaboration",
        description: "Working together with our customers and within our team to create better solutions."
      },
      {
        title: "Simplicity",
        description: "Making complex technology simple and accessible for everyone."
      },
      {
        title: "Reliability",
        description: "Delivering consistent, dependable performance you can count on 24/7."
      },
      {
        title: "Adaptability",
        description: "Evolving with the changing needs of businesses and technology landscapes."
      }
    ]
  },
  
  reviews: {
    title: "What Our Customers Say",
    subtitle: "Join thousands of satisfied businesses using AccuManage",
    labels: {
      averageRating: "Average Rating",
      verifiedReviews: "Verified Reviews",
      featured: "Featured"
    },
    noReviews: {
      title: "No Reviews Yet",
      description: "Be the first to share your experience with AccuManage and help others make an informed decision."
    }
  },
  
  cta: {
    authenticated: {
      title: "Ready to Take Your Business Further?",
      subtitle: "Continue your journey with AccuManage and unlock even more powerful features.",
      buttonText: "Go to Dashboard"
    },
    unauthenticated: {
      title: "Ready to Transform Your Business?",
      subtitle: "Join thousands of businesses already using AccuManage to streamline their operations.",
      buttonText: "Start Free Trial",
      disclaimer: "No credit card required • 14-day free trial • Cancel anytime"
    },
    secondaryButton: "Explore Features"
  },

  // Footer content
  footer: {
    company: {
      name: "AccuManage",
      description: "Streamline your business operations with our all-in-one management platform.",
      logo: "🚀"
    },
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "API", href: "/api-docs" },
          { label: "Documentation", href: "/docs" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
          { label: "Contact", href: "/contact" }
        ]
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Community", href: "/community" },
          { label: "Status", href: "/status" },
          { label: "Security", href: "/security" }
        ]
      }
    ],
    copyright: "© {year} AccuManage. All rights reserved."
  }
}