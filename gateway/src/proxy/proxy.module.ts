import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { HttpModule } from "@nestjs/axios";
import { ProxyController } from "./proxy.controller";


@Module({
    imports: [HttpModule],
    controllers: [ProxyController],
    providers: [],
})

export class ProxyModule {
    
}