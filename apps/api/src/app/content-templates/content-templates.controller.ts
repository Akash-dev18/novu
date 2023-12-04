import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { IEmailBlock, IJwtPayload, MessageTemplateContentType } from '@novu/shared';
import {
  CompileEmailTemplate,
  CompileEmailTemplateCommand,
  CompileInAppTemplate,
  CompileInAppTemplateCommand,
  JwtAuthGuard,
} from '@novu/application-generic';

import { UserSession } from '../shared/framework/user.decorator';

@Controller('/content-templates')
@UseGuards(JwtAuthGuard)
@ApiExcludeController()
export class ContentTemplatesController {
  constructor(
    private compileEmailTemplateUsecase: CompileEmailTemplate,
    private compileInAppTemplate: CompileInAppTemplate
  ) {}

  @Post('/preview/email')
  public previewEmail(
    @UserSession() user: IJwtPayload,
    @Body('content') content: string | IEmailBlock[],
    @Body('contentType') contentType: MessageTemplateContentType,
    @Body('payload') payload: any,
    @Body('subject') subject: string,
    @Body('layoutId') layoutId: string
  ) {
    return this.compileEmailTemplateUsecase.execute(
      CompileEmailTemplateCommand.create({
        userId: user._id,
        organizationId: user.organizationId,
        environmentId: user.environmentId,
        content,
        contentType,
        payload,
        subject,
        layoutId,
      })
    );
  }

  @Post('/preview/in-app')
  public previewInApp(
    @UserSession() user: IJwtPayload,
    @Body('content') content: string,
    @Body('payload') payload: any,
    @Body('cta') cta: any
  ) {
    return this.compileInAppTemplate.execute(
      CompileInAppTemplateCommand.create({
        userId: user._id,
        organizationId: user.organizationId,
        environmentId: user.environmentId,
        content,
        payload,
        cta,
      })
    );
  }
}
