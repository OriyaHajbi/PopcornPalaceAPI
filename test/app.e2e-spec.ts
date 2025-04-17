/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Relative path to src/app.module.ts
import * as request from 'supertest';

describe('Movies API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /movies/all should return all movies', () => {
    return request(app.getHttpServer())
      .get('/movies/all')
      .expect(200)
      .expect([
        {
          id: expect.any(Number), // assuming id is a number
          title: expect.any(String),
          genre: expect.any(String),
          duration: expect.any(Number),
          rating: expect.any(Number),
          releaseYear: expect.any(Number),
        },
      ]);
  });

  it('POST /movies should create a movie', () => {
    const newMovie = {
      title: 'Sample Movie Title',
      genre: 'Action',
      duration: 120,
      rating: 8.7,
      releaseYear: 2025,
    };

    return request(app.getHttpServer())
      .post('/movies')
      .send(newMovie)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          ...newMovie,
        });
      });
  });

  it('POST /movies/update/{movieTitle} should update a movie', () => {
    const updateData = {
      title: 'Updated Movie Title',
      genre: 'Comedy',
      duration: 110,
      rating: 9.0,
      releaseYear: 2026,
    };

    return request(app.getHttpServer())
      .post('/movies/update/Sample Movie Title')
      .send(updateData)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number), // Assuming the movie ID remains the same
          ...updateData,
        });
      });
  });

  it('DELETE /movies/{movieTitle} should delete a movie', () => {
    return request(app.getHttpServer())
      .delete('/movies/Sample Movie Title')
      .expect(200);
  });
});
