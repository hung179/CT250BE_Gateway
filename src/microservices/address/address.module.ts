import { RedisCacheModule } from "src/redisCache/redisCache.module";
import { RedisMessageBrokerModule } from "src/redisMessageBroker/redisMessageBroker.module";
import { AddressesService } from "./address.service";
import { Module } from "@nestjs/common";
import { AddressesController } from "./address.controller";

@Module({
    imports: [
        RedisMessageBrokerModule,
        RedisCacheModule
    ],
    providers: [AddressesService],
    controllers: [AddressesController] 
})
export class AddressModule  {}