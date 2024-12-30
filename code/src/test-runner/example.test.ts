import run from 'functions/ticket_creator';

describe('Test some function', () => {
  it('Something', () => {
    run([
      {
        payload: {
          ticket_creator: {
            work: {
              id: 'some-id',
            },
          },
        },
      },
    ]);
  });
});
