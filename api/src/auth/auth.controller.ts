import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('test')
  test() {
    return { message: 'Auth endpoint is working' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('league')
  @UseGuards(JwtAuthGuard)
  async selectLeague(@Request() req: any, @Body() body: { leagueId: string }) {
    // TODO: Implement league selection logic
    // For now, just return success
    return { 
      success: true, 
      leagueId: body.leagueId,
      message: 'League selection will be implemented' 
    };
  }
}