import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { Public } from '../common';

@Controller('health')
export class HealthController {}
