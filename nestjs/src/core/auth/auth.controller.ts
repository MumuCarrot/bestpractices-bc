import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * Creates a new user account and sets authentication tokens in HTTP-only cookies.
   *
   * @param {Object} body - Request body containing user credentials
   * @param {string} body.login - User login identifier
   * @param {string} body.password - User password
   * @param {Response} res - Express response object for setting cookies and sending response
   * @returns {Promise<Response>} HTTP response with status 201 and user data (without password)
   * @throws {HttpException} 400 Bad Request when registration fails
   */
  @Post('register')
  async register(
    @Body() body: { login: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.register(body.login, body.password);

    if (!result.success || result.error) {
      throw new HttpException(
        result.error?.message || 'Registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Set authentication tokens in HTTP-only cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      data: result.data,
    });
  }

  @Post('login')
  async login(
    @Body() body: { login: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.login(body.login, body.password);

    if (!result.success || result.error) {
      throw new HttpException(
        result.error?.message || 'Login failed',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Set authentication tokens in HTTP-only cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result.data,
    });
  }

  /**
   * Refreshes authentication tokens.
   * Uses the refresh token from cookies to generate new access and refresh tokens.
   *
   * @param {Request} req - Express request object containing cookies
   * @param {Response} res - Express response object for setting cookies and sending response
   * @returns {Promise<Response>} HTTP response with status 200 and user data (without password)
   * @throws {HttpException} 401 Unauthorized when refresh token is missing, invalid, or expired
   */
  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new HttpException(
        'Refresh token not provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.authService.refreshToken(refreshToken);

    if (!result.success) {
      const errorMessage = result.error?.message || 'Token refresh failed';
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }

    // Set new authentication tokens in HTTP-only cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      data: result.data,
    });
  }
}