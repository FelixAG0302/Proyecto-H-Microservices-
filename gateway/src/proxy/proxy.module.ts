import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { HttpModule } from "@nestjs/axios";
import { ProxyController } from "./proxy.controller";
import { JwtStrategy } from "../auth/jwt.strategy";


@Module({
    imports: [HttpModule, PassportModule],
    controllers: [ProxyController],
    providers: [JwtStrategy],
})

export class ProxyModule {
    
}