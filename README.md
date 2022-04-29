E-Voting App
=========
An example of e-voting system run on solana blockchain.

### To build
1. Clone the repo

```sh
git clone git@github.com:
```

2. Change into the project directory you'd like to run

3. Install the dependencies

```sh
npm install
```

4. Start a local Solana node

```sh
solana-test-validator
```

5. Build the anchor project

```sh
anchor build
```

6. Fetch the project ID for the build:

```sh
solana address -k target/deploy/<programname>-keypair.json
```

Update the project ID in the Rust program located at __projectname/programs/src/programname.rs__ with the output from above.

7. Run the tests

```sh
anchor test
```

8. Change into the __app__ directory and install the dependencies:

```sh
cd app && npm install
``` 

9. Rename `.env.example` to `.env` 

10. Run the client-side app

```sh
npm run dev
```
