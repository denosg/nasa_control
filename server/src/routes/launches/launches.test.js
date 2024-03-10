const request = require('supertest');
const app = require('../../app');
const {
    mongoConnect,
    mongoDisconnect,
} = require('../../services/mongo');
const {
    loadPlanetsData
} = require('../../models/planets.model');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe("Test GET /launches", () => {
        test('200 Success', async () => {
            const _ = await request(app)
                .get('/v1/launches')
                .expect("Content-Type", /json/)
                .expect(200);
        })
    })

    describe("Test POST / launches", () => {
        const completeLaunchData = {
            mission: 'Da',
            rocket: 'Menage',
            target: "Kepler-62 f",
            launchDate: "january 4, 2028",
        }

        const launchDataWithoutDate = {
            mission: 'Da',
            rocket: 'Menage',
            target: "Kepler-62 f",
        }

        const launchDataWithInvalidDate = {
            mission: 'Da',
            rocket: 'Menage',
            target: "Kepler-62 f",
            launchDate: "nu",
        }

        test('201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect("Content-Type", /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
        });
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property.'
            })
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect("Content-Type", /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid Launch Date'
            })
        });
    })
})

