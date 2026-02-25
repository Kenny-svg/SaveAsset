import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("SaveAsset", function () {

  async function deploySaveAsset() {
   
    const [owner, user, token_address] = await hre.ethers.getSigners();

    const SaveAsset = await hre.ethers.getContractFactory("SaveAsset");
    const saveAsset = await SaveAsset.deploy(await owner.getAddress());
    

    return { saveAsset, owner, user, token_address };
  }


  describe("ETH deposit()", function () {
    it("Should increase user ETH savings balance + emit event", async function () {
      const { user, saveAsset } = await loadFixture(deploySaveAsset);

      const amount = hre.ethers.parseEther("1");

      await expect(
        (saveAsset.connect(user)as any).deposit({ value: amount })
      )
        .to.emit(saveAsset, "DepositSuccessful")
        .withArgs(user.address, amount);

      // mapping(address => uint256) public balances;
      const saved = await saveAsset.balances(user.address);
      expect(saved).to.equal(amount);

      // contract ETH balance should increase
      const contractBal = await saveAsset.getContractBalance();
      expect(contractBal).to.equal(amount);
    });

    it("Should revert if msg.value is 0", async function () {
      const { user, saveAsset } = await loadFixture(deploySaveAsset);

      await expect((saveAsset.connect(user)as any).deposit({ value: 0n }))
        .to.be.revertedWith("Can't deposit zero value");
    });
  });
  describe("ERC20 deposit()", function () {
    it("Should increase user  ERC20 saving + emit event", async function () {
      const { user, saveAsset, token_address } = await loadFixture(deploySaveAsset);
      const amount = hre.ethers.parseEther("1");
      await saveAsset.getErc20SavingsBalance()

      await expect(
        (saveAsset.connect(user)as any).depositERC20( amount )
      )
        .to.emit(saveAsset, "DepositSuccessful")
        .withArgs(user.address, amount);
        await token_address.transfer(user.address, amount);
        await token_address.connect(user).approve(await saveAsset.getAddress(), amount);
      

        await token_address.connect(user).approve(await saveAsset.getAddress(), amount);

        await expect((saveAsset.connect(user) as any).depositERC20(amount))
        .to.emit(saveAsset, "DepositSuccessful")
        .withArgs(user.address, amount);
    } )
  })

  describe("ETH withdraw", function() {
    it("Should decrease user ETH savings balance + emit event", async function() {
       const { user, saveAsset } = await loadFixture(deploySaveAsset);
        const amount = hre.ethers.parseEther("1");
        await expect(
          (saveAsset.connect(user)as any).deposit({ value: amount })
        )
          .to.emit(saveAsset, "DepositSuccessful")
          .withArgs(user.address, amount);

        await expect((saveAsset.connect(user) as any).withdraw(amount))
          .to.emit(saveAsset, "WithdrawalSuccessful")
          .withArgs(user.address, amount, anyValue);

          const saved = await saveAsset.balances(user.address);
          // saveAsset.connect(user) - saved;
          // balances[msg.sender] = userSavings_ - _amount;
          expect(saved).to.not.equal(amount);

          const contractBal = await saveAsset.getContractBalance();
          expect(contractBal).to.equal(0);

    })
    it("Should revert if user tries to withdraw more than their balance", async function() {
      const { user, saveAsset } = await loadFixture(deploySaveAsset);
      const amount = hre.ethers.parseEther("1");
      await expect((saveAsset.connect(user) as any ).withdraw(amount)).to.be.revertedWith("Insufficient funds")
      
    })
    it("Should revert if user tries to withdraw 0", async function() {
      const { user, saveAsset } = await loadFixture(deploySaveAsset);
      const amount = 0;
      await expect((saveAsset.connect(user) as any ).withdraw(0n)).to.be.revertedWith("Can't withdraw zero value");
    })
    it("It should return all user balance", async function () {

      const { user, saveAsset } = await loadFixture(deploySaveAsset);
      const amount = hre.ethers.parseEther("1");
      await expect(
        (saveAsset.connect(user)as any).deposit({ value: amount })
      )
        .to.emit(saveAsset, "DepositSuccessful")
        .withArgs(user.address, amount);
      const contractBal = await saveAsset.getContractBalance();
      await expect(contractBal).to.equal(amount);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    })
  })
});
