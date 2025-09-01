# Supabase Integration Setup

This invoice application now supports Supabase as the backend database. Follow these steps to set up and run the application with Supabase.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your database to be set up (this takes a few minutes)

### 3. Configure Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` and run it
3. This will create all necessary tables, indexes, and security policies

### 4. Get Your API Keys

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key

### 5. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from step 4.

### 6. Run the Application

```bash
bun run dev
```

## 📊 Database Schema

The application uses the following tables:

### Clients
- Stores client information (name, email, address, etc.)
- Linked to invoices

### Invoices
- Main invoice records with status, amounts, dates
- References clients and has invoice items

### Invoice Items
- Individual line items for each invoice
- Quantity, price, descriptions

### Payments
- Payment records linked to invoices
- Payment methods, amounts, dates

### Profiles
- User profile information
- Company details, logo, etc.

## 🔐 Authentication

The app uses Supabase's built-in authentication system. Users can sign up and log in, and all data is automatically scoped to their user ID through Row Level Security (RLS) policies.

## 🛡️ Security

- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- All database operations are secured through Supabase's policies
- API keys are kept secure in environment variables

## 🔄 Data Migration

If you had existing data, you can:
1. Export your current data
2. Transform it to match the Supabase schema
3. Import it using Supabase's bulk insert features

## 🚀 Deployment

When deploying to production:
1. Create a production Supabase project
2. Update your production environment variables
3. Run the schema migration on your production database
4. Deploy your Next.js application

## 🐛 Troubleshooting

### Common Issues:

1. **"Environment variables not found"**
   - Make sure `.env.local` is in your project root
   - Restart your development server after adding env vars

2. **"Table doesn't exist"**
   - Make sure you've run the SQL schema in Supabase
   - Check that your migrations completed successfully

3. **"Permission denied"**
   - Verify your RLS policies are set up correctly
   - Make sure you're authenticated in the app

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

## 🎯 Features

✅ Real-time data synchronization
✅ User authentication and authorization
✅ Secure data access with RLS
✅ Automatic data relationships
✅ Type-safe database operations
✅ Built-in file storage (for logos, etc.)
✅ Real-time subscriptions (for future features)

The application now has full Supabase integration with professional-grade security, scalability, and real-time capabilities!
