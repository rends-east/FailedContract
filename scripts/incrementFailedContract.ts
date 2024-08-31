import { Address, toNano } from '@ton/core';
import { FailedContract } from '../wrappers/FailedContract';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Provide contract address: '));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const failedContract = provider.open(FailedContract.createFromAddress(address));

    const counterBefore = await failedContract.getCounter();

    await failedContract.sendIncrease(provider.sender(), {
        value: toNano('0.1'),
    });

    ui.write('Waiting for counter to increase...');

    let counterAfter = await failedContract.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await failedContract.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
