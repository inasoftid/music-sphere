import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    db: {
      provider: 'mysql',
      url: 'mysql://root:@localhost:3306/db_kursus_musik',
    },
  },
});
