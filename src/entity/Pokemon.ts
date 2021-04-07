import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	BaseEntity,
} from 'typeorm';

@Entity()
export class Pokemon extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	pokeId: number;

	@Column()
	name: string;

	@Column()
	img_url: string;

	@Column()
	weight: number;

	@Column()
	height: number;

	@Column('simple-array')
	abilities: string[];

	@Column('simple-json')
	stats: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};

	@Column('simple-array')
	types: string[];

	@CreateDateColumn()
	createdAt: Date;
}
