import { NotFoundException } from "@nestjs/common";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import { validate, ValidationError } from "class-validator";
import { FindManyOptions, Repository } from "typeorm";
import { ValidationException } from "../Exceptions/ValidationException";

export abstract class BasicEntityService<Entity, CreateEntity, EditEntity> {

    protected repository: Repository<Entity>;

    public async find(options?: FindManyOptions<Entity>) {
        return this.repository.find(options);
    }

    public async update(idOrEntity: number | Entity, data: EditEntity) {
        const entity = typeof idOrEntity === "number" ? await this.repository.findOne(idOrEntity) : idOrEntity;

        if (!entity) {
            throw new NotFoundException(`Entity "${idOrEntity}" not found.`);
        }

        plainToClassFromExist<Entity, EditEntity>(entity, data);

        await this.validate(entity);

        return this.repository.save(entity);
    }

    public async delete(idOrEntity: number | Entity) {
        const entity = typeof idOrEntity === "number" ? await this.repository.findOne(idOrEntity) : idOrEntity;

        if (!entity) {
            throw new NotFoundException(`Entity "${idOrEntity}" not found.`);
        }

        const result = await this.repository.delete(entity);

        return 1 === result.affected;
    }

    protected async internalCreate(data: CreateEntity, classType: ClassType<Entity>) {
        const entity = plainToClass<Entity, CreateEntity>(classType, data);

        await this.validate(entity);

        return this.repository.save(entity);
    }

    protected async validate(entity: Entity) {
        const errors: ValidationError[] = await validate(entity);

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }

}
