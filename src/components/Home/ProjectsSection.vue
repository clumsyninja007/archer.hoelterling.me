<script setup lang="ts">
import ProjectCard from './ProjectCard.vue'

interface Project {
  title: string
  description: string
  longDescription: string
  technologies: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
}

const getZoomClass = (index: number): string => {
  const row = Math.floor(index / 2)
  const col = index % 2
  const isEvenRow = row % 2 === 0

  if (isEvenRow) {
    return col === 0 ? 'zoom-in-75' : 'zoom-in-50'
  } else {
    return col === 0 ? 'zoom-in-50' : 'zoom-in-75'
  }
}

const projects: Project[] = [
  {
    title: 'E-commerce Platform',
    description: 'A full-featured online store with a custom CMS and payment integration.',
    longDescription: `This comprehensive e-commerce solution was built from the ground up to handle complex product catalogs and provide a seamless shopping experience.

Key features include:
• Custom CMS for product management
• Integrated payment processing with Stripe
• Real-time inventory tracking
• Advanced search and filtering
• Mobile-responsive design
• Admin dashboard with analytics

The platform successfully handles thousands of daily transactions and has helped the client increase their online revenue by 300%.`,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    image: '/projects/ecommerce.png',
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Data Analytics Dashboard',
    description: 'A real-time dashboard for visualizing complex business intelligence data.',
    longDescription: `An enterprise-grade analytics platform designed to help businesses make data-driven decisions through intuitive visualizations and real-time insights.

Key features include:
• Real-time data streaming and updates
• Interactive charts and graphs
• Custom report generation
• Multi-tenant architecture
• Role-based access control
• Export to PDF/Excel
• Predictive analytics using ML models

The dashboard processes over 10 million data points daily and serves 500+ active users across multiple departments.`,
    technologies: ['Vue.js', 'Python', 'TensorFlow', 'PostgreSQL', 'WebSocket'],
    image: '/projects/analytics.png',
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Mobile Banking App',
    description: 'A secure and user-friendly mobile application for personal banking.',
    longDescription: `A cross-platform mobile banking solution that prioritizes security and user experience, making banking accessible anytime, anywhere.

Key features include:
• Biometric authentication (Face ID/Touch ID)
• Instant money transfers
• Bill payment and scheduling
• Mobile check deposit
• Budget tracking and insights
• ATM locator with maps
• Push notifications for transactions
• End-to-end encryption

The app maintains a 4.8-star rating with over 100,000 downloads and has reduced customer service calls by 40%.`,
    technologies: ['React Native', 'Firebase', 'Node.js', 'MongoDB', 'Plaid API'],
    image: '/projects/banking.png',
    liveUrl: '#',
    githubUrl: '#'
  },
  {
    title: 'Project Management Tool',
    description: 'A collaborative tool to help teams organize tasks and track progress.',
    longDescription: `An all-in-one project management solution designed to streamline team collaboration and boost productivity across distributed teams.

Key features include:
• Kanban and Gantt chart views
• Real-time collaboration
• Time tracking and reporting
• File sharing and version control
• Integration with Slack, GitHub, and more
• Customizable workflows
• Sprint planning and retrospectives
• Resource allocation tools

Used by 50+ companies and consistently rated as a top productivity tool. Helped teams reduce project delivery time by an average of 25%.`,
    technologies: ['Angular', 'GraphQL', 'NestJS', 'PostgreSQL', 'Docker'],
    image: '/projects/project-mgmt.png',
    liveUrl: '#',
    githubUrl: '#'
  }
]
</script>

<template>
  <section id="projects" class="max-w-7xl mx-auto px-6 py-16">
    <h2 class="text-3xl font-bold mb-8">Featured Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.title"
        v-animateonscroll="{
          enterClass: `animate-enter fade-in-10 ${getZoomClass(index)} animate-duration-1000`,
        }"
        :title="project.title"
        :description="project.description"
        :long-description="project.longDescription"
        :technologies="project.technologies"
        :image="project.image"
        :live-url="project.liveUrl"
        :github-url="project.githubUrl"
      />
    </div>
  </section>
</template>

<style scoped>
</style>
