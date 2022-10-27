import { ethers } from "hardhat";

async function main() {
  const StudentSocietyDAO = await ethers.getContractFactory("StudentSocietyDAO");
  const studentSocietyDAO = await StudentSocietyDAO.deploy();
  await studentSocietyDAO.deployed();

  //本体部署地址
  console.log(`StudentSocietyDAO deployed to ${studentSocietyDAO.address}`);
  //ERC20部署地址
  const erc20address = await studentSocietyDAO.UserToken();
  console.log(`erc20 deployed to ${erc20address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
