# Omphalos UI (aka hubii core) <img src="https://ci.dev.hubii.net/app/rest/builds/buildType:(id:OmphalosUi_Build)/statusIcon"> ![GitHub release](https://img.shields.io/github/release/hubiinetwork/omphalous-ui.svg) ![GitHub](https://img.shields.io/github/license/hubiinetwork/omphalos-ui.svg)

<br />
<p align="center">
    <img src="public/images/hubii-core-logo-wtext.svg" width="300">
</p>

> Omphalos UI (hubii core) is an Ethereum wallet manager and friendly user interface to the Ethereum scaling solution nahmii, by hubii. Send and recieve crypto assets and trustlessly make instant, cheap payments and trades, all within a secure desktop environment


## Table of Contents

  * [Highlights](#highlights)
  * [Install](#install)
  * [Architecture](#architecture)
  * [Develop](#develop)
    + [Requirements](#requirements)
    + [Setup API credentials](#setup-api-credentials)
    + [Install dependencies](#install-dependencies)
    + [Run](#run)
    + [Lint](#lint)
    + [Test everything](#test-everything)
    + [Test only what's changed since the last commit](#test-only-what-s-changed-since-the-last-commit)
    + [Getting Ropsten ETH](#getting-ropsten-eth)
    + [Getting Ropsten ERC20 tokens](#getting-ropsten-erc20-tokens)
  * [Build from source](#build-from-source)
  * [Development guidelines](#development-guidelines)
    + [Boy scout rule](#boy-scout-rule)
    + [Ensuring stability when using complex selectors](#ensuring-stability-when-using-complex-selectors)
    + [Gitflow](#gitflow)
    + [Working with numbers](#working-with-numbers)
    + [Test Driven Development](#test-driven-development)
    + [Containers as sub pages](#containers-as-sub-pages)
  * [Debugging a production build](#debugging-a-production-build)

## Highlights

* Open source
* Send, receive crypto assets on the Ethereum blockchain
* Manage all wallets & addresses in one application
* Retain full custody and control of private keys
* First class Ledger Nano S support
* First class Trezor support
* Instant payments and trades without compromising on security with nahmii *(WIP)*

## Install

*macOS 10.9+, Linux, and Windows 7+ are supported (64bit only)*

Download the latest version of hubii core for your system on the [official releases page](https://github.com/hubiinetwork/omphalos-ui/releases)

## Architecture

Omphalos UI is a multiplatform desktop application built with Electron, React, Redux and styled-components. The architecture is heavily influenced the [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate/blob/master/docs/general/introduction.md) project. To understand our design decisions in greater detail, we recommend you checkout the documentaion and reasoning outlined in that repository.

## Develop

### Requirements

* NodeJS LTS
* Yarn LTS
* Python
* A C++ compiler

### Setup API credentials

1. Send an email with the subject line "API access" to [info@hubii.com](mailto:info@hubii.com), we'll get back to you within 24 hours

2. Add the credentials we provide to your PATH

### Install dependencies

```bash
yarn
```

### Run

```bash
yarn electron-dev
```

### Lint

```bash
yarn lint
```

### Test everything

```bash
yarn test
```

### Test only what's changed since the last commit

```bash
yarn test:dev
```

### Getting Ropsten ETH

There are various faucents providing free Ropsten ETH:

* faucet.ropsten.be
    * `wget https://faucet.ropsten.be/donate/<your ethereum address>`
* faucent.metamask.io
    * Follow instructions on the website

### Getting Ropsten ERC20 tokens

We recommend the ERC20 BOKKY token on Ropsten. To receive BOKKY, send Ropsten ETH to  the [BOKKY smart contract](https://ropsten.etherscan.io/address/0x583cbbb8a8443b38abcc0c956bece47340ea1367) for BOKKY tokens in return, 1 for 1.


## Build from source

```bash
# compiles and builds the app for your system architecture
# the binary will be created inside the dist folder
yarn && yarn electron-build
```

## Development guidelines

### Boy scout rule

During the early development of hubii core, different people with different opinions on testing and best practices touched the code base. As a result, you will notice some of the best practices below are not implemented everywhere you look. The majority of critical code has been refactored and we are confident in the foundations of the application, but we have a long way to go cleaning up less critical components and logic.

Instead of tackling this technical debt all at once, we ask that developers follow the "boy scout rule": leave the code you're working on in a better state than you found it. Over time, we will chip away at these smaller issues.

### Ensuring stability when using complex selectors

The architecture of hubii core relies on the library [reselect](https://github.com/reduxjs/reselect) to sit inbetween the Redux store and React components. Reselect allows us to abstract a lot of the complex data processing away from the components, keeping them as simple as possible.

One thing to be careful about when composing a complex selector is that you considered all possible structures input selectors can take, for example a selector could either be 'loaded', 'loading', or 'errored'. Forgetting to check for an uncommmon state like 'errored' can be easy, and cause catastrophic failure for the user.

The best way to lower chances of this kind of failure occuring is to test your selector/component with every variation of its possible inputs. To make this as frictionless as possible, please maintain a `mocks/selectors.js` file in a container's `tests` folder, that contains samples of every variation of structure a selector could return (see `containers/WalletHOC/tests/mocks/selectors.js` for an example).

Then when you or another developer wants to reach for a selector, when they're writing their tests they can be confident that they know exactly which inputs they need to test, and have the ability to effortlessly import the required mocked state.

### Gitflow

Please obey by established Gitflow principles. Details can be obtained in post by Vincent Driessen or in Atlassian's Gitflow Workflow tutorial. Driessen's git-flow git extension is indispensable.

### Working with numbers

During blockchain development, you'll often find yourself working with very small and very large numbers. When dealing with these types of numbers (notably Ether or token amounts), use the BigNumber library to ensure precision isn't lost. If you're interested to read more see [this](https://hackernoon.com/a-note-on-numbers-in-ethereum-and-javascript-3e6ac3b2fad9) article for a concise explination.

### Test Driven Development

Here is a [video](https://www.infoq.com/presentations/testing-communication) about TDD, introducing the motivations behind writing good unit tests.

For examples on how to write tests for different parts of a container, please refer to the tests in `containers/StriimAccounts/tests`:

*index.test.js*: Test the logics at the `container` level. `component` tests can be constructed similarly to this.

*actions.test.js*: Test any `actions`

*reducer.test.js*: Test the container `reducer`

*saga.test.js*: Test any `saga` logic. We recommend and are currently migrating all our saga tests to use [redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan)

### Containers as sub pages

Some containers contain up to 3 levels of complex components. Combining all the logic of each component into a single container could make the code difficult to maintain and difficult to schedule development.

To isolate the complexities between the sub components, the parent container can use sub routes to wire up the sub components. This enable isolating the logics in the parent page container from their sub pages, as well as isolating the logics between the sub pages.

Take the striim tab page for example, the sub pages structured like: `containers/Striim` > `containers/StrrimAccounts` > `containers/SwapCurrencies`

`containers/Striim` container is the parent page of the sub pages `accounts` and `contacts`. It  handles its own container logics and only know about the sub route path for its child containers. When the route matches `/accounts`, it renders `StriimAccountsContainer`.

Sample codes from `containers/Striim`:

```js
<StriimTabs defaultActiveKey={history.location.pathname}>
    <TabPane tab="Accounts" key={`${match.url}/accounts`}>
        <Route path={`${match.url}/accounts`} component={StriimAccountsContainer} />
    </TabPane>
    <TabPane tab="Contacts" key={`${match.url}/contacts`}>
        Content of Tab Pane 2
    </TabPane>
</StriimTabs>
```

`containers/StriimAccounts` container is the parent page of a number of sub pages such as `payment`, `savings`, `swap currencies` etc. Although it has quite a number of sub pages, it handles its own container logics and have the sub pages to handle by them own.

In order to let the sub pages know which account and currency is currently chosen, it dispatch the actions `CHANGE_CURRENT_CURRENCY` or `CHANGE_CURRENT_ACCOUNT`, so the sub pages can react respectively.

Take Swap Currency sub page for example, it connects the `currentCurrency` with the state in the  `store` using [reselect](https://github.com/reduxjs/reselect). Whenever there is an update to this `currentCurrency` state, the swap currency container re-render the view to reflect the newly chosen currency from its parent container `containers/StriimAccounts`.

Sample codes from `containers/SwapCurrencies` on connecting the props to the defined states from the `store`.

```js
import { makeSelectCurrentCurrency } from 'containers/StriimAccounts/selectors';
const mapStateToProps = createStructuredSelector({
  currentCurrency: makeSelectCurrentCurrency(),
});
```

## Debugging a production build

The dev tools can be opened with `Cmd+Alt+I` on macOS, or `Ctrl+Shift+I` on Linux and Windows.
