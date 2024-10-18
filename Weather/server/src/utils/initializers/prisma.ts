/**
 * @fileoverview Initializes and exports an instance of PrismaClient.
 *
 * This module creates a single instance of PrismaClient which is used to interact
 * with the database throughout the application. The instance is exported as the
 * default export of the module.
 *
 * @module utils/initializers/prisma
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
