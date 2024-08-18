import { Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// const createUserSchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// type CreateUserSchemaType = z.infer<typeof createUserSchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwtService: JwtService) {}

  @Post()
  async handle() {
    const token = this.jwtService.sign({ sub: 'user-id' });

    return { token };
  }
}
