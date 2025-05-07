import { ShippingInformationController } from "./shipInfor.controller";
import { ShippingInformationService } from "./shipInfor.service";
import { Module } from "@nestjs/common";
import { RedisCacheModule } from "src/redisCache/redisCache.module";
import { RedisMessageBrokerModule } from "src/redisMessageBroker/redisMessageBroker.module";

@Module({
    imports: [RedisMessageBrokerModule,
        RedisCacheModule
    ],
    controllers: [ShippingInformationController],
    providers: [ShippingInformationService]
}) 
export class ShippingInformationModule {}