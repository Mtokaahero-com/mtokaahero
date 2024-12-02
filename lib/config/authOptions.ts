import { type NextAuthOptions } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import { CredentialsProvider } from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { fetchUsers } from './FetchUsers';
