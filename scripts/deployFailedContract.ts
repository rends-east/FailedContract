import { toNano } from '@ton/core';
import { FailedContract } from '../wrappers/FailedContract';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const failedContract = provider.open(
        FailedContract.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('FailedContract')
        )
    );

    await failedContract.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(failedContract.address);

    console.log('ID', await failedContract.getID());
}
