import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Online School Platform API',
      version: '1.0.0',
      description: 'API документація для платформи онлайн школи з роль-базованим доступом',
      contact: {
        name: 'API Support',
        email: 'support@schoolplatform.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:2000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введіть JWT токен отриманий після логіну'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'BAD_REQUEST'
                },
                message: {
                  type: 'string',
                  example: 'Invalid request data'
                },
                details: {
                  type: 'object'
                }
              }
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            password: {
              type: 'string',
              example: 'SuperSecure123!'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        AcceptInviteRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: {
              type: 'string',
              example: 'a1b2c3d4e5f6...'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'newpassword123'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxxx123456'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            name: {
              type: 'string',
              nullable: true
            },
            globalRole: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'USER']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CreateSchoolRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Harvard University'
            }
          }
        },
        School: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxxx123456'
            },
            name: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        InviteSchoolAdminRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'schooladmin@example.com'
            },
            expiresInHours: {
              type: 'number',
              default: 72,
              example: 72
            }
          }
        },
        InviteResponse: {
          type: 'object',
          properties: {
            inviteUrl: {
              type: 'string',
              example: 'http://localhost:5173/accept-invite?token=abc123...'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CreateClassRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Mathematics 101'
            }
          }
        },
        Class: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            schoolId: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        InviteToSchoolRequest: {
          type: 'object',
          required: ['email', 'role'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'teacher@example.com'
            },
            role: {
              type: 'string',
              enum: ['TEACHER', 'STUDENT'],
              example: 'TEACHER'
            },
            classId: {
              type: 'string',
              description: 'Optional: ID класу для прямого зарахування'
            },
            expiresInHours: {
              type: 'number',
              default: 72,
              example: 72
            }
          }
        },
        CreateMessageRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              maxLength: 5000,
              example: 'Welcome to the class!'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            classId: {
              type: 'string'
            },
            authorId: {
              type: 'string'
            },
            text: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            author: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string', nullable: true }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints для автентифікації та управління сесіями'
      },
      {
        name: 'Super Admin',
        description: 'Endpoints доступні тільки для Super Admin'
      },
      {
        name: 'School Admin',
        description: 'Endpoints для адміністраторів шкіл'
      },
      {
        name: 'Classes',
        description: 'Endpoints для роботи з класами та повідомленнями'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
