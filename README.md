# Readme

# **AI Client Acquisition Platform**

A Next.js-based web application designed to help businesses streamline their client acquisition process using AI. This platform enables users to create targeted outreach campaigns, personalize messages, and track potential client interactions.

## **Features**

- **AI-Powered Outreach**: Generate personalized messages for potential clients
- **Campaign Management**: Create, manage, and track outreach campaigns
- **Dashboard**: Visualize campaign performance and client acquisition metrics
- **Feedback Collection**: Gather insights from users with an integrated feedback bot

## **Tech Stack**

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: MongoDB (Mongoose)
- **HTTP Client**: Axios
- **Authentication**: (Include your auth solution here)

## **Getting Started**

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance
- npm or yarn

### Installation

1. Clone the repository:

git clone https://github.com/yourusername/ai-client-acquisition.git

cd ai-client-acquisition

1. Install dependencies:

npm install

# or

yarn install

1. Create a `.env.local` file in the root directory with the following variables:

MONGODB_URI=your_mongodb_connection_string

NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Add any other environment variables required for your project

1. Run the development server:

npm run dev

# or

yarn dev

1. Open http://localhost:3000 in your browser to access the application.

## **Usage**

### Creating a Campaign

1. Navigate to the Dashboard
2. Click "Create Campaign" button
3. Fill in campaign details, including:
    - Campaign name
    - Target audience
    - Services offered
    - Skills to highlight
4. Submit the form to create your campaign

### Managing Campaigns

The dashboard provides an overview of all your campaigns with options to:

- View campaign details
- Edit campaign information
- Track campaign performance
- View potential client matches

### Personalized Outreach

For each potential client match:

1. Review their profile and match reason
2. Use the AI-generated personalized message or create your own
3. Track engagement and responses

## **Project Structure**

ai-client-acquisition/

├── public/              # Static files

├── src/

│   ├── app/             # Next.js app directory

│   │   ├── api/         # API routes

│   │   ├── dashboard/   # Dashboard page

│   │   └── ...          # Other pages

│   ├── components/      # React components

│   │   ├── analytics/   # Analytics components

│   │   ├── dashboard/   # Dashboard components

│   │   └── ui/          # UI components

│   ├── lib/             # Utility functions

│   └── ...

├── .env.local           # Environment variables

├── next.config.js       # Next.js configuration

└── ...

## **API Endpoints**

### Campaigns

- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create a new campaign
- `GET /api/campaigns/retrieve` - Retrieve campaign data

## **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## **Acknowledgments**

- Next.js team for the amazing framework
- shadcn/ui for the beautiful UI components
- All contributors who have helped shape this project