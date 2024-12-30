import { client, publicSDK } from '@devrev/typescript-sdk';
import { log } from 'console';

export const run = async (events: any[]) => {
  const PART_ID = 'PROD-1';
  const OWNER = 'devrev-bot';

  for (const event of events) {
    try {
      const endpoint = event.execution_metadata.devrev_endpoint;
      const token = event.context.secrets.service_account_token;

      // Initialize the public SDK client
      const devrevSDK = client.setup({ endpoint, token });

      // Fetch the part details
      const partsResponse = await devrevSDK.partsList();
      console.log('Parts:', partsResponse.data.parts);

      const part = partsResponse.data.parts.find((p: any) => p.display_id === 'PROD-1');
      if (!part) {
        throw new Error('Part not found');
      }
      const PART_ID = part.id;

      // Fetch the owner
      const usersResponse = await devrevSDK.devUsersList();
      const owner = usersResponse.data.dev_users.find((u: any) => u.display_id === 'DEVU-1');
      if (!owner) {
        throw new Error('Owner not found');
      }
      const OWNER = owner.id;

      // Create a ticket. Name the ticket using the current date and time.
      const date = new Date();
      const ticketName = `Ticket created at ${date.toLocaleString()}`;
      const ticketBody = `This ticket was created by a snap-in at ${date.toLocaleString()}`;

      const response = await devrevSDK.worksCreate({
        title: ticketName,
        body: ticketBody,
        applies_to_part: PART_ID,
        owned_by: [OWNER],
        type: publicSDK.WorkType.Ticket,
      });

      console.log('Ticket created successfully:', response);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  }
};

export default run;
