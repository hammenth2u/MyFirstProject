<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200311145622 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE access (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, project_id INT DEFAULT NULL, access_type VARCHAR(50) NOT NULL, INDEX IDX_6692B54A76ED395 (user_id), INDEX IDX_6692B54166D1F9C (project_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_label (card_id INT NOT NULL, label_id INT NOT NULL, INDEX IDX_3693A12E4ACC9A20 (card_id), INDEX IDX_3693A12E33B92F39 (label_id), PRIMARY KEY(card_id, label_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE access ADD CONSTRAINT FK_6692B54A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE access ADD CONSTRAINT FK_6692B54166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('ALTER TABLE card_label ADD CONSTRAINT FK_3693A12E4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_label ADD CONSTRAINT FK_3693A12E33B92F39 FOREIGN KEY (label_id) REFERENCES label (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE comment ADD card_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id)');
        $this->addSql('CREATE INDEX IDX_9474526C4ACC9A20 ON comment (card_id)');
        $this->addSql('ALTER TABLE label ADD project_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE label ADD CONSTRAINT FK_EA750E8166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('CREATE INDEX IDX_EA750E8166D1F9C ON label (project_id)');
        $this->addSql('ALTER TABLE project ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EEA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_2FB3D0EEA76ED395 ON project (user_id)');
        $this->addSql('ALTER TABLE card ADD project_id INT DEFAULT NULL, ADD status VARCHAR(30) NOT NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('CREATE INDEX IDX_161498D3166D1F9C ON card (project_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE access');
        $this->addSql('DROP TABLE card_label');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3166D1F9C');
        $this->addSql('DROP INDEX IDX_161498D3166D1F9C ON card');
        $this->addSql('ALTER TABLE card DROP project_id, DROP status');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C4ACC9A20');
        $this->addSql('DROP INDEX IDX_9474526C4ACC9A20 ON comment');
        $this->addSql('ALTER TABLE comment DROP card_id');
        $this->addSql('ALTER TABLE label DROP FOREIGN KEY FK_EA750E8166D1F9C');
        $this->addSql('DROP INDEX IDX_EA750E8166D1F9C ON label');
        $this->addSql('ALTER TABLE label DROP project_id');
        $this->addSql('ALTER TABLE project DROP FOREIGN KEY FK_2FB3D0EEA76ED395');
        $this->addSql('DROP INDEX IDX_2FB3D0EEA76ED395 ON project');
        $this->addSql('ALTER TABLE project DROP user_id');
    }
}
