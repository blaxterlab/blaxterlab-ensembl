=head1 LICENSE

Copyright [1999-2014] Wellcome Trust Sanger Institute and the EMBL-European Bioinformatics Institute

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

=cut

=head1 MODIFICATIONS

Copyright [2014-2015] University of Edinburgh

All modifications licensed under the Apache License, Version 2.0, as above.

=cut

## If you wish to use the EnsEMBL web-code from the command line, you will
## need to hardcode the server root here 

## $SiteDefs::ENSEMBL_SERVERROOT = '/path to root of ensembl tree';

$SiteDefs::ENSEMBL_PLUGINS = [

  #'MyPlugins'               => $SiteDefs::ENSEMBL_WEBROOT.'/my-plugins',
  # ebi search
  #'EG::EBEyeSearch'         => $SiteDefs::ENSEMBL_SERVERROOT.'/eg-web-search',
 # blast using ebi service
# 'EG::Blast'               => $SiteDefs::ENSEMBL_SERVERROOT.'/eg-web-blast',
  

  
#  'EnsEMBL::Mirror'     => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/mirror',
#  'EG::Metazoa'             => $SiteDefs::ENSEMBL_SERVERROOT.'/eg-web-metazoa',
  'EG::LepBase'             => $SiteDefs::ENSEMBL_SERVERROOT.'/lepbase-ensembl',
# 'EnsEMBL::Lucene'     => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/genoverse',

## Common must come after the division specific plugins above
  'EG::Common'              => $SiteDefs::ENSEMBL_SERVERROOT.'/eg-web-common',

  # scrollabel view
  'EnsEMBL::Genoverse'      => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/genoverse',

  ## These are...
  'EnsEMBL::Users'      => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/users',
  'EnsEMBL::Memcached'      => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/memcached',
# 'EnsEMBL::ORM'        => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/orm',
 'EnsEMBL::Ensembl'    => $SiteDefs::ENSEMBL_SERVERROOT.'/public-plugins/ensembl'
];

1;
